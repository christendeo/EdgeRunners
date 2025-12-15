// Component for ediiting user profile
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client/react";
import {EDIT_USER} from "../lib/userGraphQL";

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
        height: "",
        weight: "",
        activity_level: "light",
        diet_goal: "maintain",
        password: ""
    });

    useEffect(() => {

        // Check if user is logged in
        if (userAuth && userAuth.user) {
            const currentUser = userAuth.user;

            setFormData({
                first_name: currentUser.first_name || "",
                last_name: currentUser.last_name || "",
                email: currentUser.email || "",
                sex: currentUser.sex || "female",
                date_of_birth: currentUser.date_of_birth || "",
                height: currentUser.height !== undefined && currentUser.height !== null ? String(currentUser.height) : "",
                weight: currentUser.weight !== undefined && currentUser.weight !== null ? String(currentUser.weight) : "",
                activity_level: currentUser.activity_level || "light",
                diet_goal: currentUser.diet_goal || "maintain",
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

        // Parse floats only if provided and changed
        if (formData.height !== "") {
            const heightNum = parseFloat(formData.height);
            if (isNaN(heightNum)) {
                setErrorMessage("Oh no! Height must be a valid number :(");
                return;
            }

            if (heightNum !== userAuth.user.height) {
                userFields.height = heightNum;
            }
        }

        if (formData.weight !== "") {
            const weightNum = parseFloat(formData.weight);
            if (isNaN(weightNum)) {
                setErrorMessage("Oh no! Weight must be a valid number :(");
                return;
            }

            if (weightNum !== userAuth.user.weight) {
                userFields.weight = weightNum;
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
        <div>
            <h1>Edit Profile</h1>

            {/*For error or success messages*/}
            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>

                <div>
                    <label>Last Name</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>

                <div>
                    <label>Email Address</label>
                    <input name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div>
                    <label>Sex</label>
                    <select name="sex" value={formData.sex} onChange={handleChange}>
                        <option value="female">female</option>
                        <option value="male">male</option>
                    </select>
                </div>

                <div>
                    <label>Date of Birth (MM/DD/YYYY)</label>
                    <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                </div>

                <div>
                    <label>Height (cm)</label>
                    <input name="height" value={formData.height} onChange={handleChange} />
                </div>

                <div>
                    <label>Weight (kg)</label>
                    <input name="weight" value={formData.weight} onChange={handleChange} />
                </div>

                <div>
                    <label>Activity Level</label>
                    <select name="activity_level" value={formData.activity_level} onChange={handleChange}>
                        <option value="sedentary">sedentary</option>
                        <option value="light">light</option>
                        <option value="moderate">moderate</option>
                        <option value="active">active</option>
                        <option value="very_active">very_active</option>
                    </select>
                </div>

                <div>
                    <label>Diet Goal</label>
                    <select name="diet_goal" value={formData.diet_goal} onChange={handleChange}>
                        <option value="lose">lose</option>
                        <option value="maintain">maintain</option>
                        <option value="gain">gain</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}