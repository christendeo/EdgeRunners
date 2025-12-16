// User account creation
import React, {useContext, useState, useEffect} from "react";
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";
import clientHelpers from "../helpers/conversionHelpers";
import {ADD_USER} from "../lib/userGraphQL";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

const SignupPage = () => {
    const router = useRouter();
    const userAuth = useContext(AuthContext);
        useEffect(() => {
    
            // Check first if user is logged in
            if (userAuth.authLoaded) {
                if (userAuth.user) {
                    router.push("/dashboard");
                }
            }
    
        }, [userAuth.authLoaded, userAuth.user, router]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        sex: "female",
        date_of_birth: "",
        height_ft: "",
        height_in: "",
        weight_lbs: "",
        activity_level: "light",
        diet_goal: "maintain",
        use_custom_target: false,
        custom_target_calories: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [addUser, {loading}] = useMutation(ADD_USER);


    // For handling user changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((previousValues) => {
            return {
                ...previousValues,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Convert height and weight to numbers. Validations first
        let heightObj = clientHelpers.checkHeightFeetInches(
            formData.height_ft,
            formData.height_in,
            "Height"
        );
        let heightCm = clientHelpers.feetInchesToCm(heightObj.feet, heightObj.inches);
        let weightLbs = clientHelpers.checkWeightLbs(
            formData.weight_lbs,
            "Weight (lbs)"
        );
        let weightKg = clientHelpers.lbsToKg(weightLbs);
        let useCustomTarget = false;

        // Check if custom target is enabled
        if (formData.use_custom_target === true) {
            useCustomTarget = true;
        }

        let customTarget = null;
        if (useCustomTarget === true) {
            let customCalories = null;
            if (typeof formData.custom_target_calories === "string") {
                let trimmedCalorieData = formData.custom_target_calories.trim();
                if (trimmedCalorieData.length > 0) {
                    customCalories = Number(trimmedCalorieData);
                }
            } else if (typeof formData.custom_target_calories === "number") {
                customCalories = formData.custom_target_calories;
            }

            customTarget = clientHelpers.checkCustomTargetCalories(
                customCalories,
                "Custom Target Calories"
            );

            if (customTarget === null) {
                setErrorMessage("Oh no! Please enter custom target calories or turn off custom target :(");
                return;
            }
        }

        try {
            const {data} = await addUser({
                variables: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    sex: formData.sex,
                    date_of_birth: formData.date_of_birth,
                    height: heightCm,
                    weight: weightKg,
                    use_custom_target: useCustomTarget,
                    custom_target_calories: customTarget,
                    activity_level: formData.activity_level,
                    diet_goal: formData.diet_goal
                }
            });

            // If successful, redirect to login
            if (data && data.addUser) {
                userAuth.login(data.addUser);
                router.push("/dashboard");
            }

        } catch (e) {

            // Signup failed
            console.error(e);
            setErrorMessage(e.message || "Oh no! Something went wrong :(");
        }
    };

    // For displaying the page
    return (
        <div className={`${tailwindCSS.pageWrap} flex justify-center`}>
            <div className="w-full max-w-2xl">

                <h1 className={`${NimbusFont.className} ${tailwindCSS.h1} mb-3`}>Create an Account</h1>
                <p className="text-sm opacity-80 mb-6">
                    Enter your info to calculate your daily targets.
                </p>

                {/*For error or success messages*/}
                {errorMessage &&
                    <div className={`${tailwindCSS.alertError} mb-4`}>
                        {errorMessage}
                    </div>}

                {successMessage &&
                    <div className={`${tailwindCSS.alertSuccess} mb-4`}>
                        {successMessage}
                    </div>}

                <div className={tailwindCSS.cardSoft}>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`${NimbusFont.className}`}>First Name</label>
                                <input
                                    className={tailwindCSS.input}
                                    type="text"
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`${NimbusFont.className}`}>Last Name</label>
                                <input
                                    className={tailwindCSS.input}
                                    type="text"
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`${NimbusFont.className}`}>Email Address</label>
                            <input
                                className={tailwindCSS.input}
                                type="email"
                                name="email"
                                placeholder="Enter Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className={`${NimbusFont.className}`}>Password</label>
                            <input
                                className={tailwindCSS.input}
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`${NimbusFont.className}`}>Sex</label>
                                <select
                                    className={tailwindCSS.input}
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                >
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </select>
                            </div>

                            <div>
                                <label className={`${NimbusFont.className}`}>Date of Birth (MM/DD/YYYY)</label>
                                <input
                                    className={tailwindCSS.input}
                                    type="text"
                                    name="date_of_birth"
                                    placeholder="Enter DOB"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={`${NimbusFont.className}`}>Height (ft)</label>
                                <input
                                    className={tailwindCSS.input}
                                    type="number"
                                    name="height_ft"
                                    placeholder="ft"
                                    value={formData.height_ft}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`${NimbusFont.className}`}>Height (in)</label>
                                <input
                                    className={tailwindCSS.input}
                                    type="number"
                                    name="height_in"
                                    placeholder="in"
                                    value={formData.height_in}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`${NimbusFont.className}`}>Weight (lbs)</label>
                                <input
                                    className={tailwindCSS.input}
                                    type="number"
                                    step="0.1"
                                    name="weight_lbs"
                                    placeholder="lbs"
                                    value={formData.weight_lbs}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`${NimbusFont.className}`}>Activity Level</label>
                                <select
                                    className={tailwindCSS.input}
                                    name="activity_level"
                                    value={formData.activity_level}
                                    onChange={handleChange}
                                >
                                    <option value="sedentary">Sedentary</option>
                                    <option value="light">Light</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="active">Active</option>
                                    <option value="very_active">Very Active</option>
                                </select>
                            </div>

                            <div>
                                <label className={`${NimbusFont.className}`}>Goal</label>
                                <select
                                    className={tailwindCSS.input}
                                    name="diet_goal"
                                    value={formData.diet_goal}
                                    onChange={handleChange}
                                >
                                    <option value="lose">Lose</option>
                                    <option value="maintain">Maintain</option>
                                    <option value="gain">Gain</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.use_custom_target}
                                onChange={(e) => {

                                    const checkedCustomTarget = e.target.checked;

                                    setFormData((previousData) => {
                                        let updatedData = {
                                            ...previousData,
                                            use_custom_target: checkedCustomTarget
                                        };

                                        if (checkedCustomTarget === false) {
                                            updatedData.custom_target_calories = "";
                                        }

                                        return updatedData;
                                    });
                                }}
                            />
                            <span className={`${NimbusFont.className}`}>Use Custom Target Calories</span>
                        </div>

                        <div>
                            <label className={`${NimbusFont.className}`}>Custom Target Calories</label>
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

                        <button className={`${NimbusFont.className}`} type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default SignupPage;