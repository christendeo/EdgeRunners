// Component for user to change password ONLY when they are logged in
import React, {useState} from "react";
import {useMutation} from "@apollo/client/react";
import {CHANGE_PASSWORD} from "../lib/userGraphQL";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

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
    let hiddenEmail = "";
    if (userAuth && userAuth.user && userAuth.user.email) {
        hiddenEmail = userAuth.user.email;
    }

    return (
        <div className={tailwindCSS.cardSoft}>
            <h2 className={`${tailwindCSS.h2} ${NimbusFont.className}`}>Change Password</h2>

            {/*For displaying error messages or success*/}
            <div className="mt-3 space-y-2">
                {errorMessage &&
                    <div className={tailwindCSS.alertError}>
                        {errorMessage}
                    </div>}

                {successMessage &&
                    <div className={tailwindCSS.alertSuccess}>
                        {successMessage}
                    </div>}
            </div>

            <form onSubmit={handleSubmit} autoComplete="on" className="mt-4 space-y-4">
                <input
                    type="email"
                    name="email"
                    value={hiddenEmail}
                    readOnly
                    autoComplete="username"
                    style={{display: "none"}}
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium">Old Password</label>
                    <input
                        className={tailwindCSS.input}
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">New Password</label>
                    <input
                        className={tailwindCSS.input}
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input
                        className={tailwindCSS.input}
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <button className={tailwindCSS.btnPrimary} type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}