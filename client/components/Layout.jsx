// Layout pattern
import Link from "next/link";
import {useContext} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";

export default function Layout( {children} ) {

    // For storing user session
    const router = useRouter();
    const userAuth = useContext(AuthContext);

    const currentUser = userAuth.user;
    const authLoaded = userAuth.authLoaded;

    // Dynamically make FuelMe go to dashboard when logged in
    let homeLink = "/";

    if (authLoaded && currentUser) {
        homeLink = "/dashboard";
    }

    return (
        <div>
            <header>
                <Link href={homeLink}>FuelMe</Link>

                {/*Navigation bar, can be reused across all our pages*/}
                <div>
                    <Link href="/foods">Foods</Link>{" "}
                    <Link href="/meals">Meals</Link>{" "}
                    <Link href="/community/allPosts">Community</Link>
                </div>

                <div>
                    {!authLoaded && (
                        <div>Loading...</div>
                    )}

                    {/*Check if user is authenticated*/}
                    {authLoaded && !currentUser && (
                        <div>
                            <Link href="/login">Login</Link>{" "}
                            <Link href="/signup">Signup</Link>
                        </div>
                    )}

                    {authLoaded && currentUser && (
                        <div>
                            <Link href="/dashboard">Dashboard</Link>{" "}
                            <Link href="/profile">Profile</Link>{" "}
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
                    )}
                </div>
            </header>

            <main>{children}</main>
        </div>
    );
}