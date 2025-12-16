import React, {useContext} from "react";
import {useQuery} from "@apollo/client/react";
import {AuthContext} from "../lib/userAuthContext";
import clientHelpers from "../helpers/conversionHelpers";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

import {GET_RANGED_FOOD_LOGS} from "../queries/foodLogQueries";

export default function UserTodaysProgress() {
    const userAuth = useContext(AuthContext);

    // User auth
    if (!userAuth || !userAuth.user) {
        return null;
    }

    const currentUser = userAuth.user;
    const todayStr = clientHelpers.getTodaysQueryDate();
    const {data, loading, error} = useQuery(GET_RANGED_FOOD_LOGS, {
        variables: {
            _id: currentUser?._id,
            startDate: todayStr,
            endDate: todayStr
        },
        skip: !currentUser?._id,
        fetchPolicy: "network-only"
    });

    // Get current daily
    let todaysLog = null;

    if (data && data.getRangedFoodLogs && Array.isArray(data.getRangedFoodLogs)) {
        if (data.getRangedFoodLogs.length > 0) {
            todaysLog = data.getRangedFoodLogs[0];
        }
    }

    const targetCalories = clientHelpers.getUserDisplayedTargetCalories(currentUser);

    let consumedCalories = 0;
    let proteinG = 0;
    let carbsG = 0;
    let fatG = 0;

    // Validations
    if (todaysLog) {
        consumedCalories = clientHelpers.safeNumber(todaysLog.daily_total_calories);
        proteinG = clientHelpers.safeNumber(todaysLog.daily_total_protein);
        carbsG = clientHelpers.safeNumber(todaysLog.daily_total_carbs);
        fatG = clientHelpers.safeNumber(todaysLog.daily_total_fat);
    }

    const caloriePerentage = clientHelpers.calcPercent(consumedCalories, targetCalories);
    const macroCals = clientHelpers.macroCaloriesFromGrams(proteinG, carbsG, fatG);

    let proteinPct = 0;
    let carbsPct = 0;
    let fatPct = 0;

    // Calculate macro reports
    if (macroCals.totalMacroCals > 0) {
        proteinPct = (macroCals.proteinCals / macroCals.totalMacroCals) * 100;
        carbsPct = (macroCals.carbsCals / macroCals.totalMacroCals) * 100;
        fatPct = (macroCals.fatCals / macroCals.totalMacroCals) * 100;

        proteinPct = clientHelpers.clampNumber(proteinPct, 0, 100);
        carbsPct = clientHelpers.clampNumber(carbsPct, 0, 100);
        fatPct = clientHelpers.clampNumber(fatPct, 0, 100);
    }

    // Display render page
    return (
        <div className={tailwindCSS.cardSoft}>
            <div className="flex items-center justify-between mb-2">
                <h2 className={tailwindCSS.h2}>Today’s Progress</h2>
                <div className="text-sm opacity-70">{todayStr}</div>
            </div>

            {/*For displaying error or success messages*/}
            {loading && <p className="text-sm opacity-70">Loading today’s progress...</p>}
            {error && <p className={tailwindCSS.alertError}>Oh no! Could not load today’s progress :(</p>}

            {!loading && !error && !todaysLog && (
                <p className="text-sm opacity-70">
                    No food log found for today yet. Add a log to start tracking :)
                </p>
            )}

            {!loading && !error && todaysLog && (
                <>

                    {/* Calories */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium">Calories</span>
                            <span>
                                {consumedCalories}
                                {targetCalories !== null ? ` / ${targetCalories}` : ""}
                            </span>
                        </div>

                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-3 bg-gradient-to-b from-[#73AF6F] to-[#007E6E]"
                                style={{width: `${caloriePerentage}%`}}
                            />
                        </div>

                        <div className="text-xs mt-1 opacity-70">
                            {Math.round(caloriePerentage)}% of target
                        </div>
                    </div>

                    {/* Macros breakdown bar */}
                    <div className="mt-5">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium">Macro Breakdown</span>
                            <span className="opacity-70">
                                P {proteinG}g • C {carbsG}g • F {fatG}g
                            </span>
                        </div>

                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                            <div
                                className="h-3 bg-blue-500"
                                style={{width: `${proteinPct}%`}}
                                title="Protein"
                            />
                            <div
                                className="h-3 bg-yellow-500"
                                style={{width: `${carbsPct}%`}}
                                title="Carbs"
                            />
                            <div
                                className="h-3 bg-red-500"
                                style={{width: `${fatPct}%`}}
                                title="Fat"
                            />
                        </div>

                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span>Protein</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                                <span>Carbs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full" />
                                <span>Fat</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}