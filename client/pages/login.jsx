// User login page
import React, {useContext, useState} from "react";
import {gql} from "@apollo/client";
import {useMutation} from "@apollo/client/react";
import {useRouter} from "next/router";
import Link from "next/link";
import {LOGIN_USER} from "../lib/userGraphQL";

// Utilize userAuthHelpers
import {AuthContext} from "../lib/userAuthContext";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

// Login details
const LoginPage = () => {

    const router = useRouter();
    const userAuth = useContext(AuthContext);

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

                userAuth.login(userData);
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
        <div className={`${tailwindCSS.pageWrap} flex justify-center`}>
            <div className="w-full max-w-md">

                <h1 className={`${NimbusFont.className} ${tailwindCSS.h1} font-bold mb-3`}>Log In</h1>
                <p className="text-sm opacity-80 mb-6">
                    Welcome back! Log in to view your dashboard.
                </p>

                {/*For error or success messages*/}
                {errorMessage && (
                    <div className={`${tailwindCSS.alertError} mb-4`}>
                        {errorMessage}
                    </div>
                )}

                <div className={tailwindCSS.cardSoft}>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className={`font-semibold ${NimbusFont.className}`}>Email Address</label>
                            <input
                                className={tailwindCSS.input}
                                type="email"
                                placeholder="Enter Email Address"
                                value={userEmailAddress}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label className={`font-semibold ${NimbusFont.className}`}>Password</label>
                            <input
                                className={tailwindCSS.input}
                                type="password"
                                placeholder="Enter Password"
                                value={userPassword}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                required
                            />
                        </div>

                        <button className={`${tailwindCSS.btnPrimary} w-full`} type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Log In"}
                        </button>

                        {/*If user has no account, prompt to sign up*/}
                        <div className="text-sm">
                            No Account?{" "}
                            <Link className={tailwindCSS.link} href="/signup">
                                Sign Up Today
                            </Link>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;