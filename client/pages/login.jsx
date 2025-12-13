// User login page
import React, {useState} from "react";
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import {useRouter} from "next/router";

// Login user using authentication. Show all fields
const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            _id
            first_name
            last_name
            email
            sex
            date_of_birth
            height
            weight
            activity_level
            diet_goal
            target_calories
        }
    }
`;


const LoginPage = () => {

    const router = useRouter();

    const [userEmailAddress, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [loginUser, {loading}] = useMutation(LOGIN_USER);

    // For handling user login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const {data} = await loginUser({
                variables: {
                    email: userEmailAddress,
                    password: userPassword
                }
            });

            // If user logs in successfully or not
            if (data && data.loginUser) {
                const userData = data.loginUser;
                localStorage.setItem("fuelme_user_id", userData._id);
                localStorage.setItem("fuelme_user_name", userData.first_name);

                // Store full user for the dashboard
                localStorage.setItem("fuelmeUser", JSON.stringify(userData));

                router.push("/dashboard");
            }
        } catch (e) {

            // Login failed
            console.error(e);
            setErrorMessage(e.message || "Oh no! Login failed :(");
        }
    };

    // For displaying the page
    return (
        <div className="page-container">
            <h1>Log In</h1>

            {/*For displaying error messages*/}
            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-row">
                    <label>Email</label>
                    <input
                        type="email"
                        value={userEmailAddress}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Password</label>
                    <input
                        type="password"
                        value={userPassword}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;