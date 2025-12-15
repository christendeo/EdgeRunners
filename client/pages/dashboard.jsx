// Display user dashboard
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

// Utilize userAuthContext
import {AuthContext} from "../lib/userAuthContext";

export default function DashboardPage() {
    const router = useRouter();
    const userAuth = useContext(AuthContext);

    // Ensure user is actually logged in
    useEffect(() => {
        if (userAuth.authLoaded) {
            if (!userAuth.user) {
                router.push("/login");
            }
        }
    }, [userAuth.authLoaded, userAuth.user, router]);

    if (!userAuth.authLoaded) {
        return (
            <div className="card">
                <h1>User Dashboard</h1>
                <p>Loading...</p>
            </div>
        );
    }

    // If user is not logged in
    if (!userAuth.user) {
        return (
            <div className="card">
                <h1>User Dashboard</h1>
                <p>Oh no! You are not logged in.</p>
                <p>
                    <Link href="/login">Login Here</Link>
                </p>
            </div>
        );
    }

    const currentUser = userAuth.user;

    // Display page
    return (
        <div>
            <h1>Hello, {currentUser.first_name}</h1>

            <h2>Profile Information</h2>
            <div>Email: {currentUser.email}</div>
            <div>Sex: {currentUser.sex}</div>
            <div>DOB: {currentUser.date_of_birth}</div>

            <h2>Goals</h2>
            <div>Diet Goal: {currentUser.diet_goal}</div>
            <div>Activity Level: {currentUser.activity_level}</div>
            <div>Target Calories: {currentUser.target_calories}</div>

            <h2>Quick Links</h2>
            <Link href="/profile">Edit Profile</Link>{" "}
            <div><Link href="/foods">Foods</Link></div>
            <div><Link href="/meals">Meals</Link></div>
            <Link href="/community/allPosts">Community</Link>

            <button
                type="button"
                onClick={() => {
                    userAuth.logout();
                    router.push("/login");
                }}
            >
                Logout
            </button>
        </div>
    );
}