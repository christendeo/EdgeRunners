// User profile page with ability to edit
import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";
import EditProfileForm from "../components/EditProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ProfilePage() {

    // Initialize user profile state
    const router = useRouter();
    const userAuth = useContext(AuthContext);

    useEffect(() => {

        // Check first if user is logged in
        if (userAuth.authLoaded) {
            if (!userAuth.user) {
                router.push("/login");
            }
        }

    }, [userAuth.authLoaded, userAuth.user, router]);

    if (!userAuth.authLoaded) {
        return <div>Loading...</div>;
    }

    if (!userAuth.user) {
        return <div>Redirecting...</div>;
    }

    // Render display page
    return (
        <div>
            <EditProfileForm
                userAuth={userAuth}
                onUserUpdated={(updatedUser) => {
                    userAuth.login(updatedUser);
                }}
            />

            <ChangePasswordForm userAuth={userAuth} />
        </div>
    );
}