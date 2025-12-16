// Display home page or dashboard, depending on whether user is signed in
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import {AuthContext} from "../lib/userAuthContext";
import localFont from 'next/font/local';

const NimbusFont = localFont({ 
  src: '../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
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
            <div>
                <h1>FuelMe</h1>
                <p>Loading...</p>
            </div>
        );
    }

    // If logged out, show the public home page
    return (
        <div>
            <div className={NimbusFont.className}>
                <h1 className='text-6xl text-center text-lightgreen mx-12 my-6 border-b-4 border-white pb-2'>Welcome to FuelMe</h1>
            </div>
            <p className="text-center text-3xl pb-4">Please log in or sign up to get started</p>
            <div className="grid grid-cols-3 mx-12 my-6 justify-between">
                <div className="flex order-first grid mx-4">
                    <h2 className='text-center text-2xl text-lightgreen col-start-1 row-start-1'>Acheive your fitness goals</h2>
                    <p className="text-white text-center">With FuelMe, acheiving your fitness goals is easier than ever. Simply enter some basic information about you and your goals and FuelMe will create custom macro goals just for you!</p>
                </div>
                <div className="flex grid mx-4">
                    <h2 className="text-center text-2xl text-lightgreen col-start-1 row-start-1">Find foods you enjoy</h2>
                    <p className="text-white text-center">Track what you eat throughout the day and see how close you are to reaching your goals. FuelMe has hundreds of foods and meals in its system with all of the information you need 
                        to reach your daily goals. Can't find your favorite meal? Don't worry, you can create your own!
                    </p>
                </div>
                <div className="flex grid order-last mx-4">
                    <h2 className="text-center text-2xl text-lightgreen col-start-1 row-start-1">Track your progress</h2>
                    <p className="text-white text-center">Create logs of everything you eat and monitor your progress over time. As you start to see results, you can adjust your goals whenever you need to.</p>
                </div>
            </div>
        </div>
    );
}