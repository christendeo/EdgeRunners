// Display user's weekly summary, not just current day
import React, {useMemo} from "react";
import {useQuery} from "@apollo/client/react";

// Import helpers
import dashboardHelpers from "@/helpers/dashboardHelpers";
import conversionHelpers from "@/helpers/conversionHelpers";
import {GET_RANGED_FOOD_LOGS} from "@/queries/foodLogQueries";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

export default function WeeklySummary({targetCalories}) {
    const dateRange = dashboardHelpers.getLast7DaysRange();
    const currentDays = useMemo(() => {
        return dashboardHelpers.buildLast7Days();
    }, []);

    const {data, loading, error} = useQuery(GET_RANGED_FOOD_LOGS, {
        variables: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        },
        fetchPolicy: "cache-and-network"
    });

    // Obtain range of food logs for the week
    const getFoodLogs = useMemo(() => {
        let list = [];
        if (data && data.getRangedFoodLogs) {
            list = data.getRangedFoodLogs;
        }
        return list;
    }, [data]);

    const logsByDate = useMemo(() => {
        return dashboardHelpers.indexLogsByDate(getFoodLogs);
    }, [getFoodLogs]);

    const totalSum = useMemo(() => {
        return dashboardHelpers.sumWeeklyTotals(getFoodLogs);
    }, [getFoodLogs]);

    const maxBar = useMemo(() => {
        return dashboardHelpers.getMaxBarValue(currentDays, logsByDate, targetCalories);
    }, [currentDays, logsByDate, targetCalories]);

    if (loading) {
        return (
            <div className={tailwindCSS.cardSoft}>
                <div className={`${tailwindCSS.h2} ${NimbusFont.className}`}>Weekly Summary</div>
                <p className="text-sm opacity-70 mt-2">Loading your last 7 days…</p>
            </div>
        );
    }

    // For handling errors
    if (error) {
        return (
            <div className={tailwindCSS.cardSoft}>
                <div className={`${tailwindCSS.h2} ${NimbusFont.className}`}>Weekly Summary</div>
                <p className={tailwindCSS.alertError + " mt-2"}>{error.message}</p>
            </div>
        );
    }

    // Display widget
    return (
        <div className={tailwindCSS.cardSoft}>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className={`${tailwindCSS.h2} ${NimbusFont.className}`}>Weekly Summary</div>
                    <div className="text-sm opacity-70">
                        {dateRange.startDate} - {dateRange.endDate}
                    </div>
                </div>

                <div className="text-right text-sm">
                    <div className="opacity-70">Week total calories</div>
                    <div className="text-xl font-semibold">{totalSum.calories}</div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4 text-sm">
                <div className="rounded-lg border p-3">
                    <div className="opacity-70">Protein</div>
                    <div className="text-lg font-semibold">{totalSum.protein}g</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="opacity-70">Carbs</div>
                    <div className="text-lg font-semibold">{totalSum.carbs}g</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="opacity-70">Fat</div>
                    <div className="text-lg font-semibold">{totalSum.fat}g</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="opacity-70">Days Logged</div>
                    <div className="text-lg font-semibold">{getFoodLogs.length}/7</div>
                </div>
            </div>

            <div className="mt-5">
                <div className="text-sm font-semibold mb-2">Calories By Day</div>

                <div className="flex items-end gap-2 h-28">
                    {currentDays.map((nowDay) => {
                        let getLog = logsByDate[nowDay.key];
                        let getCalories = conversionHelpers.safeNumber(getLog?.daily_total_calories);
                        let pctValue = 0;
                        if (maxBar > 0) {
                            pctValue = Math.round((getCalories / maxBar) * 100);
                        }

                        // Display a bar graph of the calories amount
                        return (
                            <div key={nowDay.key} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full bg-black/5 rounded-md h-24 flex items-end overflow-hidden">
                                    <div
                                        className="w-full bg-gradient-to-b from-lightgreen to-darkgreen"
                                        style={{height: `${pctValue}%`}}
                                        title={`${nowDay.key}: ${Math.round(getCalories)} kcal`}
                                    />
                                </div>
                                <div className="text-xs opacity-70">{nowDay.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}