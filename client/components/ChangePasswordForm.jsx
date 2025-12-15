// Component for user to change password ONLY when they are logged in
import React, {useState} from "react";
import {useMutation} from "@apollo/client/react";
import {CHANGE_PASSWORD} from "../lib/userGraphQL";

export default function ChangePasswordForm({userAuth}) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [changePasswordMutation, {loading}] = useMutation(CHANGE_PASSWORD);

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

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

        // Check if user is logged in
        if (!userAuth || !userAuth.user) {
            setErrorMessage("Oh no! You must be logged in :(");
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            setErrorMessage("Oh no! New passwords do not match :(");
            return;
        }

        try {
            await changePasswordMutation({
                variables: {
                    _id: userAuth.user._id,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                }
            });

            setSuccessMessage("Yay! Password updated :)");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });

        } catch (e) {
            console.error(e);
            setErrorMessage(e.message || "Oh no! Could not update password :(");
        }
    };

    // Render display user profile change password page
    return (
        <div>
            <h2>Change Password</h2>

            {/*For error or success messages*/}
            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}

            <form onSubmit={handleSubmit} autoComplete="on">

                {/* Helps browser know which account this password is for */}
                <input
                    type="email"
                    name="email"
                    value={userAuth.user ? userAuth.user.email : ""}
                    readOnly
                    autoComplete="username"
                    style={{ display: "none" }}
                />

                <div>
                    <label>Old Password</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                </div>

                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}