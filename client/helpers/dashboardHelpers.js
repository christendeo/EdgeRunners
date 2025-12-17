// Helpers for dashboard widgets like weekly summary, charts, etc.
import conversionHelpers from "./conversionHelpers";

const exportedMethods = {
    getLast7DaysRange() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        return {
            startDate: conversionHelpers.formatDateForQuery(startDate),
            endDate: conversionHelpers.formatDateForQuery(endDate)
        };
    },

    buildLast7Days() {
        const getDays = [];
        const todayDate = new Date();

        // Iterate through each day
        for (let tracker = 6; tracker >= 0; tracker--) {
            const getDate = new Date(todayDate);
            getDate.setDate(todayDate.getDate() - tracker);

            getDays.push({
                key: conversionHelpers.formatDateForQuery(getDate),
                label: getDate.toLocaleDateString("en-US", { weekday: "short" })
            });
        }

        return getDays;
    },

    indexLogsByDate(getLogs) {
        const getMap = {};

        if (!Array.isArray(getLogs)) {
            return getMap;
        }

        for (let tracker = 0; tracker < getLogs.length; tracker++) {
            const currentLog = getLogs[tracker];
            if (currentLog && currentLog.date) {
                getMap[currentLog.date] = currentLog;
            }
        }

        return getMap;
    },

    sumWeeklyTotals(getLogs) {
        let getCalories = 0;
        let getProtein = 0;
        let getCarbs = 0;
        let getFat = 0;

        if (!Array.isArray(getLogs)) {
            return {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };
        }

        // Iterate through each log and calculate sum of each macro
        for (let tracker = 0; tracker < getLogs.length; tracker++) {
            const log = getLogs[tracker];

            getCalories += conversionHelpers.safeNumber(log?.daily_total_calories);
            getProtein += conversionHelpers.safeNumber(log?.daily_total_protein);
            getCarbs += conversionHelpers.safeNumber(log?.daily_total_carbs);
            getFat += conversionHelpers.safeNumber(log?.daily_total_fat);
        }

        return {
            calories: Math.round(getCalories),
            protein: Math.round(getProtein),
            carbs: Math.round(getCarbs),
            fat: Math.round(getFat)
        };
    },

    getMaxBarValue(days, logsByDate, targetCalories) {
        let maxVal = 1;

        // Iterate and find total calories
        for (let tracker = 0; tracker < days.length; tracker++) {
            const dayKey = days[tracker].key;
            const foodLog = logsByDate[dayKey];

            const caloriesCount = conversionHelpers.safeNumber(foodLog?.daily_total_calories);
            if (caloriesCount > maxVal) {
                maxVal = caloriesCount;
            }
        }

        if (targetCalories !== undefined && targetCalories !== null) {
            const targetCal = conversionHelpers.safeNumber(targetCalories);
            if (targetCal > maxVal) {
                maxVal = targetCal;
            }
        }

        return maxVal;
    }
};

export default exportedMethods;