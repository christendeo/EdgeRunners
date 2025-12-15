// Layout pattern
import Link from "next/link";
import Image from "next/image";
import {useContext} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";
import localFont from 'next/font/local';

const NimbusFont = localFont({ 
  src: '../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});

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
        <>
        <div className={NimbusFont.className}>
            <header className="flex justify-between p-4 bg-neutral-800">
                <div className="flex gap-4 text-4xl items-center text-center  ">
                    <Link href="/">
                        <Image src="/FuelMeLogo.svg" alt="Logo" width={60} height={60} />
                    </Link>
                    <Link className= "text-white hover:underline mt-3"href="/foods">Foods</Link>
                    <Link className= "text-white hover:underline mt-3"href="/meals">Meals</Link>
                    <Link className= "text-white hover:underline mt-3"href="/community/allPosts">Community</Link>
                    <Link className= "text-white hover:underline mt-3"href="/foodlogs">My Logs</Link>
                </div>

                <div className="flex  gap-4 text-2xl items-center text-center">
                    {!authLoaded && (
                        <div>Loading...</div>
                    )}

                    {/*Check if user is authenticated*/}
                    {authLoaded && !currentUser && (
                        <div className="flex gap-4 text-4xl items-center text-center  mt-3">
                            <Link href="/login">Login</Link>
                            <Link href="/signup">Signup</Link>
                        </div>
                    )}

                    {authLoaded && currentUser && (
                        <div className="flex gap-4 text-3xl">
                            <Link href="/dashboard">Dashboard</Link>
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
        </div>
        <main>{children}</main>
        </>


    );
}