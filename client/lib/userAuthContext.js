// Implement a global React state with helper functions for user authentication
import React, {createContext, useEffect, useState} from "react";
export const AuthContext = createContext(null);

// Authentication Logic
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStored = localStorage.getItem("fuelmeUser");

            // Get user logged in
            if (userStored) {
                try {
                    const userParsed = JSON.parse(userStored);
                    setUser(userParsed);
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setAuthLoaded(true);
        }
    }, []);

    const userLogin = (userData) => {
        if (!userData) {
            return;
        }

        // Ensure the user session is stored
        if (typeof window !== "undefined") {
            localStorage.setItem("fuelmeUser", JSON.stringify(userData));

            if (userData._id) {
                localStorage.setItem("fuelme_user_id", userData._id);
            }
        }

        setUser(userData);
    };

    const userLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("fuelmeUser");
            localStorage.removeItem("fuelme_user_id");
            localStorage.removeItem("fuelme_user_name");
        }

        setUser(null);
    };

    // Keeps auth synced across tabs
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const onStorage = () => {
            const userStored = localStorage.getItem("fuelmeUser");

            if (!userStored) {
                setUser(null);
                return;
            }

            try {
                const userParsed = JSON.parse(userStored);
                setUser(userParsed);
            } catch (e) {
                setUser(null);
            }
        };

        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user: user,
                authLoaded: authLoaded,
                login: userLogin,
                logout: userLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};