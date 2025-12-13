// Reset password if needed
import {useState} from "react";
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";

const RESET_PASSWORD = gql`
    mutation ResetPassword($email: String!, $newPassword: String!) {
        resetPassword(
            email: $email
            newPassword: $newPassword
        )
    }
`;

// Handle forgot password
export default function ForgotPasswordPage() {
    const [form, setForm] = useState({
        email: "",
        newPassword: ""
    });

    const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);

    const handleChange = (field) => {
        return (e) => {
            const newValue = e.target.value;
            const newForm = { ...form };
            newForm[field] = newValue;
            setForm(newForm);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await resetPassword({
            variables: {
                email: form.email,
                newPassword: form.newPassword
            }
        });
    };

    let buttonText = "Reset Password";
    if (loading) {
        buttonText = "Resetting...";
    }

    // Render and display page
    return (
        <div className="card">
            <h1>Forgot Password</h1>
            <p style={{ marginBottom: "0.75rem" }}>
                Enter your email and a new password.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                    />
                </div>

                <div className="form-row">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={form.newPassword}
                        onChange={handleChange("newPassword")}
                    />
                </div>

                <button className="button-primary" type="submit" disabled={loading}>
                    {buttonText}
                </button>
            </form>

            {/*If there is an error message, display it*/}
            {error && (
                <p className="message-error">Error: {error.message}</p>
            )}

            {/*If successful*/}
            {data && data.resetPassword && (
                <p className="message-success">
                    Password has been reset for {form.email}.
                </p>
            )}
        </div>
    );
}