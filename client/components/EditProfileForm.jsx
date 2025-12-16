// Component for ediiting user profile
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client/react";
import {EDIT_USER} from "../lib/userGraphQL";
import clientHelpers from "../helpers/conversionHelpers";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

export default function EditProfileForm({userAuth, onUserUpdated}) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [editUserMutation, {loading}] = useMutation(EDIT_USER);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        sex: "female",
        date_of_birth: "",

        height_ft: "",
        height_in: "",
        weight_lbs: "",

        activity_level: "light",
        diet_goal: "maintain",

        use_custom_target: false,
        custom_target_calories: "",

        password: ""
    });

    useEffect(() => {

        // Check if user is logged in
        if (userAuth && userAuth.user) {
            const currentUser = userAuth.user;
            let ftInHeight = clientHelpers.cmToFeetInches(currentUser.height);
            let lbsValWeight = clientHelpers.kgToLbs(currentUser.weight);

            // Display form and handle form data
            setFormData({
                first_name: currentUser.first_name || "",
                last_name: currentUser.last_name || "",
                email: currentUser.email || "",
                sex: currentUser.sex || "female",
                date_of_birth: currentUser.date_of_birth || "",

                height_ft: ftInHeight.feet !== "" ? String(ftInHeight.feet) : "",
                height_in: ftInHeight.inches !== "" ? String(ftInHeight.inches) : "",
                weight_lbs: lbsValWeight !== "" ? String(lbsValWeight) : "",

                activity_level: currentUser.activity_level || "light",
                diet_goal: currentUser.diet_goal || "maintain",

                use_custom_target: currentUser.use_custom_target === true,
                custom_target_calories: currentUser.custom_target_calories !== undefined && currentUser.custom_target_calories !== null
                    ? String(currentUser.custom_target_calories)
                    : "",

                password: ""
            });
        }

    }, [userAuth]);

    // Handling user profile form
    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData((prevUserData) => {
            return {
                ...prevUserData,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (!userAuth || !userAuth.user) {
            setErrorMessage("Oh no! You must be logged in :(");
            return;
        }

        // Only build for fields to be changed
        const userFields = {
            _id: userAuth.user._id
        };

        if (formData.first_name !== userAuth.user.first_name) {
            userFields.first_name = formData.first_name;
        }

        if (formData.last_name !== userAuth.user.last_name) {
            userFields.last_name = formData.last_name;
        }

        if (formData.email !== userAuth.user.email) {
            userFields.email = formData.email;
        }

        if (formData.sex !== userAuth.user.sex) {
            userFields.sex = formData.sex;
        }

        if (formData.date_of_birth !== userAuth.user.date_of_birth) {
            userFields.date_of_birth = formData.date_of_birth;
        }

        // Height conversion for backend
        if (formData.height_ft !== "" || formData.height_in !== "") {

            // Validations
            let heightObj = clientHelpers.checkHeightFeetInches(
                formData.height_ft,
                formData.height_in,
                "Height"
            );

            let heightCm = clientHelpers.feetInchesToCm(heightObj.feet, heightObj.inches);
            if (heightCm !== userAuth.user.height) {
                userFields.height = heightCm;
            }
        }

        // Weight conversion for backend
        if (formData.weight_lbs !== "") {

            // Validations
            let lbsNum = clientHelpers.checkWeightLbs(
                formData.weight_lbs,
                "Weight (lbs)"
            );

            let weightKg = clientHelpers.lbsToKg(lbsNum);
            if (weightKg !== userAuth.user.weight) {
                userFields.weight = weightKg;
            }
        }

        // Custom target toggle
        if (formData.use_custom_target !== userAuth.user.use_custom_target) {
            userFields.use_custom_target = formData.use_custom_target;
        }

        if (formData.use_custom_target === true) {
            let customNum = null;
            if (typeof formData.custom_target_calories === "string") {
                let trimmedCalories = formData.custom_target_calories.trim();
                if (trimmedCalories.length > 0) {
                    customNum = Number(trimmedCalories);
                }
            } else if (typeof formData.custom_target_calories === "number") {
                customNum = formData.custom_target_calories;
            }

            let checkedCustomCalories = clientHelpers.checkCustomTargetCalories(customNum, "Custom Target Calories");

            if (checkedCustomCalories === null) {
                setErrorMessage("Oh no! Please enter custom target calories or turn off custom target :(");
                return;
            }

            if (checkedCustomCalories !== userAuth.user.custom_target_calories) {
                userFields.custom_target_calories = checkedCustomCalories;
            }

        } else {

            // When turning off custom target, clear custom calories
            if (userAuth.user.custom_target_calories !== null && userAuth.user.custom_target_calories !== undefined) {
                userFields.custom_target_calories = null;
            }
        }

        if (formData.activity_level !== userAuth.user.activity_level) {
            userFields.activity_level = formData.activity_level;
        }

        if (formData.diet_goal !== userAuth.user.diet_goal) {
            userFields.diet_goal = formData.diet_goal;
        }

        // Only send if user typed it
        if (formData.password.trim() !== "") {
            userFields.password = formData.password;
        }

        // If nothing changed besides _id, do nothing
        if (Object.keys(userFields).length === 1) {
            setSuccessMessage("Nothing to update :)");
            return;
        }

        try {
            const {data} = await editUserMutation({
                variables: userFields
            });

            if (data && data.editUser) {
                if (onUserUpdated) {
                    onUserUpdated(data.editUser);
                }

                setSuccessMessage("Yay! Profile updated :)");
                setFormData((prev) => {
                    return {
                        ...prev,
                        password: ""
                    };
                });
            }

        } catch (e) {
            console.error(e);
            setErrorMessage(e.message || "Oh no! Could not update profile :(");
        }
    };

    // Render display user profile page
    return (
        <div className={tailwindCSS.cardSoft}>
            <h1 className={`${NimbusFont.className} ${tailwindCSS.h1} font-bold`}>Edit Profile</h1>

            {/*For displaying error or success messages*/}
            <div className="mt-3 space-y-2">
                {errorMessage && <div className={tailwindCSS.alertError}>{errorMessage}</div>}
                {successMessage && <div className={tailwindCSS.alertSuccess}>{successMessage}</div>}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">First Name</label>
                        <input className={tailwindCSS.input} name="first_name" value={formData.first_name} onChange={handleChange} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Last Name</label>
                        <input className={tailwindCSS.input} name="last_name" value={formData.last_name} onChange={handleChange} />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input className={tailwindCSS.input} name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Sex</label>
                        <select className={tailwindCSS.input} name="sex" value={formData.sex} onChange={handleChange}>
                            <option value="female">female</option>
                            <option value="male">male</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Date of Birth (MM/DD/YYYY)</label>
                        <input className={tailwindCSS.input} name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Height (ft)</label>
                        <input className={tailwindCSS.input} type="number" name="height_ft" value={formData.height_ft} onChange={handleChange} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Height (in)</label>
                        <input className={tailwindCSS.input} type="number" name="height_in" value={formData.height_in} onChange={handleChange} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Weight (lbs)</label>
                        <input className={tailwindCSS.input} type="number" step="0.1" name="weight_lbs" value={formData.weight_lbs} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Activity Level</label>
                        <select className={tailwindCSS.input} name="activity_level" value={formData.activity_level} onChange={handleChange}>
                            <option value="sedentary">sedentary</option>
                            <option value="light">light</option>
                            <option value="moderate">moderate</option>
                            <option value="active">active</option>
                            <option value="very_active">very_active</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Diet Goal</label>
                        <select className={tailwindCSS.input} name="diet_goal" value={formData.diet_goal} onChange={handleChange}>
                            <option value="lose">lose</option>
                            <option value="maintain">maintain</option>
                            <option value="gain">gain</option>
                        </select>
                    </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.use_custom_target}
                            onChange={(e) => {
                                const checked = e.target.checked;

                                setFormData((previousData) => {
                                    const updatedData = {
                                        ...previousData,
                                        use_custom_target: checked
                                    };

                                    if (checked === false) {
                                        updatedData.custom_target_calories = "";
                                    }

                                    return updatedData;
                                });
                            }}
                        />
                        <label className="text-sm font-medium">Use Custom Target Calories</label>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Custom Target Calories</label>
                        <input
                            className={tailwindCSS.input}
                            type="number"
                            name="custom_target_calories"
                            placeholder="ex: 2000"
                            value={formData.custom_target_calories}
                            onChange={handleChange}
                            disabled={formData.use_custom_target === false}
                        />
                    </div>
                </div>

                <button className={tailwindCSS.btnPrimary} type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}