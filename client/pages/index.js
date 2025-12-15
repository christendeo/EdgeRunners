// Display home page or dashboard, depending on whether user is signed in
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";

export default function Home() {

    const router = useRouter();
    const userAuth = useContext(AuthContext);

    const currentUser = userAuth.user;
    const authLoaded = userAuth.authLoaded;

    useEffect(() => {

        if (!authLoaded) {
            return;
        }

        if (currentUser) {
            router.replace("/dashboard");
        }

    }, [authLoaded, currentUser, router]);

    // Check if user is authenticated
    if (!authLoaded) {
        return (
            <div>
                <h1>FuelMe</h1>
                <p>Loading...</p>
            </div>
        );
    }

    // If logged out, show the public home page
    return (
        <div>
            <h1>FuelMe</h1>
            <p>Welcome! Please log in or sign up to get started.</p>
        </div>
    );
}