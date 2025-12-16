// Implement a global React state with helper functions for user authentication
import { createContext, useEffect, useState } from 'react';
export const AuthContext = createContext(null);

// Authentication Logic
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStored = localStorage.getItem('fuelme_user');
			const token = localStorage.getItem('fuelme_token');

            // Get user logged in
            if (userStored && token) {
                try {
                    const userParsed = JSON.parse(userStored);
                    setUser(userParsed);
                } catch (e) {
                    setUser(null);
					localStorage.removeItem('fuelme_token');
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
        if (typeof window !== 'undefined') {
            localStorage.setItem("fuelme_user", JSON.stringify(userData));

            if (userData._id) {
                localStorage.setItem("fuelme_user_id", userData._id);
            }

			if (userData.token) {
				localStorage.setItem('fuelme_token', userData.token);
			}
        }

        setUser(userData);
    };

    const userLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('fuelme_user');
            localStorage.removeItem('fuelme_user_id');
            localStorage.removeItem('fuelme_user_name');
			localStorage.removeItem('fuelme_token');
        }

        setUser(null);
    };

    // Keeps auth synced across tabs
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const onStorage = () => {
            const userStored = localStorage.getItem("fuelme_user");
			const token = localStorage.getItem('fuelme_token');

            if (!userStored || !token) {
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

        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
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