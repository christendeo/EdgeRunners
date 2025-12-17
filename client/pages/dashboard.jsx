// Display user dashboard
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import TodaysProgress from "../components/UserTodaysProgress";
import WeeklySummary from "@/components/WeeklySummary";
import RecentActivityPosts from "@/components/RecentActivityPosts";

// Utilize userAuthContext
import {AuthContext} from "../lib/userAuthContext";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

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
    let displayTarget = currentUser.target_calories;

    if (currentUser.current_target_calories !== undefined && currentUser.current_target_calories !== null) {
        displayTarget = currentUser.current_target_calories;
    }

    // Display page
    return (
        <div className={tailwindCSS.pageWrap}>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className={`${tailwindCSS.h1} ${NimbusFont.className}`}>
                        Hello, {currentUser.first_name}
                    </h1>
                    <p className="text-sm opacity-80">
                        Here’s your daily target and quick actions.
                    </p>
                </div>

                <button
                    className={tailwindCSS.btnSecondary}
                    type="button"
                    onClick={() => {
                        userAuth.logout();
                        router.push("/login");
                    }}
                >
                    Logout
                </button>
            </div>

            <hr className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className={tailwindCSS.card}>
                    <div className={`${tailwindCSS.h2} ${NimbusFont.className} mb-3`}>Target Calories</div>
                    <div className="text-2xl font-bold">{displayTarget}</div>
                </div>

                <div className={tailwindCSS.card}>
                    <div className={`${tailwindCSS.h2} ${NimbusFont.className} mb-3`}>Diet Goal</div>
                    <div className="text-xl font-semibold capitalize">{currentUser.diet_goal}</div>
                </div>

                <div className={tailwindCSS.card}>
                    <div className={`${tailwindCSS.h2} ${NimbusFont.className} mb-3`}>Activity Level</div>
                    <div className="text-xl font-semibold capitalize">{currentUser.activity_level}</div>
                </div>
            </div>

            <div className={tailwindCSS.card}>
                <h2 className={`${tailwindCSS.h2} ${NimbusFont.className} mb-3`}>Profile</h2>
                <div className="text-sm space-y-1">
                    <div>Email: {currentUser.email}</div>
                    <div>Sex: {currentUser.sex}</div>
                    <div>DOB: {currentUser.date_of_birth}</div>
                </div>
            </div>

            <div className={`${tailwindCSS.card} mt-6`}>
                <TodaysProgress />
            </div>

            <div className={tailwindCSS.pageWrap}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <WeeklySummary targetCalories={displayTarget} />
                    <RecentActivityPosts />
                </div>
            </div>

            <div className={`${tailwindCSS.card} mt-6`}>
                <h2 className={`${tailwindCSS.h2} ${NimbusFont.className} mb-3`}>Quick Links</h2>

                <div className="flex flex-wrap gap-2">
                    <Link className={tailwindCSS.btnSmallPrimary} href="/profile">Edit Profile</Link>

                    <Link className={tailwindCSS.btnSecondary} href="/foods">Foods</Link>

                    <Link className={tailwindCSS.btnSecondary} href="/foodlogs">Food Logs</Link>

                    <Link className={tailwindCSS.btnSecondary} href="/community/allPosts">Community</Link>
                </div>
            </div>

        </div>
    );
}