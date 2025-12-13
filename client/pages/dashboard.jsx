// Dispaly user dashboard
// client/pages/dashboard.jsx
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = window.localStorage.getItem("fuelmeUser");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setUser(parsed);
                } catch (e) {
                    console.log(e);
                }
            }
            setLoaded(true);
        }
    }, []);

    if (!loaded) {
        return (
            <div className="card">
                <h1>Dashboard</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="card">
                <h1>Dashboard</h1>
                <p>You are not logged in.</p>
                <p>
                    <Link href="/login">Go to login</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="card">
            <h1>Hello, {user.first_name}</h1>
            <p style={{ marginBottom: "1rem" }}>
                Here is a quick overview of your profile and daily target.
            </p>

            <section style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem" }}>Profile</h2>
                <p>Email: {user.email}</p>
                <p>Sex: {user.sex}</p>
                <p>Date of Birth: {user.date_of_birth}</p>
            </section>

            <section style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem" }}>Body & Activity</h2>
                <p>Height: {user.height} cm</p>
                <p>Weight: {user.weight} kg</p>
                <p>Activity Level: {user.activity_level}</p>
                <p>Diet Goal: {user.diet_goal}</p>
            </section>

            <section style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem" }}>Daily Targets</h2>
                <p>Target Calories: {user.target_calories} kcal</p>
                <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                    Your daily calorie target is calculated based on your height, weight,
                    sex, age, activity level, and diet goal.
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: "1.1rem" }}>Next Steps</h2>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                    <li>
                        <Link href="/foods">Browse foods</Link>
                    </li>
                    <li>
                        <Link href="/meals">Build or view meals</Link>
                    </li>
                    <li>
                        <Link href="/logs">Log today&apos;s food intake</Link>
                    </li>
                    <li>
                        <Link href="/community">Visit the community/blogs</Link>
                    </li>
                </ul>
            </section>
        </div>
    );
}