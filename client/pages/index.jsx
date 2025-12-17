// Display home page or dashboard, depending on whether user is signed in
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";
import Link from "next/link";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

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
            <div className={tailwindCSS.pageWrap}>
                <h1 className={`${tailwindCSS.h1} ${NimbusFont.className}`}>FuelMe</h1>
                <p className="opacity-70 mt-2">Loading...</p>
            </div>
        );
    }

    // If logged out, show the public home page
    return (
        <div className={tailwindCSS.pageWrap}>

            {/* Main Window */}
            <div className="relative overflow-hidden rounded-2xl border p-8">
                <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-lightgreen to-darkgreen" />
                <div className="relative">
                    <h1 className={`${NimbusFont.className} ${tailwindCSS.h1} md:text-6xl leading-tight`}>
                        Welcome to <span className="text-lightgreen">FuelMe</span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-lg opacity-80">
                        With FuelMe, achieving your fitness goals is easier than ever. Simply enter some basic information about you and your goals and FuelMe will create custom macro goals just for you!
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/signup" className={tailwindCSS.btnPrimary}>
                            Create Account
                        </Link>

                        <Link href="/login" className={tailwindCSS.btnSecondary}>
                            Log In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className={tailwindCSS.cardSoft}>
                    <h2 className={`${NimbusFont.className} text-xl font-semibold text-lightgreen`}>
                        Achieve Your Daily Targets
                    </h2>
                    <p className="mt-2 text-sm opacity-80">
                        Track what you eat throughout the day and see how close you are to reaching your goals. FuelMe has hundreds of foods and meals in its system with all of the information you need
                        to reach your daily goals. Can't find your favorite meal? Don't worry, you can create your own!
                    </p>
                </div>

                <div className={tailwindCSS.cardSoft}>
                    <h2 className={`${NimbusFont.className} text-xl font-semibold text-lightgreen`}>Track Progress Over Time</h2>
                    <p className="mt-2 text-sm opacity-80">
                        Create daily logs of everything you eat and monitor your progress over time. As you start to see results, you can adjust your goals whenever you need to.
                    </p>
                </div>

                <div className={tailwindCSS.cardSoft}>
                    <h2 className={`${NimbusFont.className} text-xl font-semibold text-lightgreen`}>Community Blog Center</h2>
                    <p className="mt-2 text-sm opacity-80">
                        Want to share your journey? Post updates in the community blog and interact with others through comments and feedback while keeping your personal details private.
                    </p>
                </div>
            </div>
        </div>
    );
}