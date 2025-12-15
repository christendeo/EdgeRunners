"use client";
import {useContext, useEffect, useState, useRef} from "react";
import {useRouter} from "next/router";
import localFont from 'next/font/local';
import {useQuery, useMutation} from "@apollo/client/react";
import AddFoodLog from "../components/AddFoodLog.jsx";
import UpdateFoodLog from "../components/UpdateFoodLog.jsx";
import {AuthContext} from "../lib/userAuthContext";

const NimbusFont = localFont({ 
  src: '../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});

import { 
    GET_RANGED_FOOD_LOGS,
    UPDATE_FOOD_LOG,
    REMOVE_FOOD_LOG,
} from "../queries/foodLogQueries";

import { GET_USER_MEALS } from "../queries/mealQueries";

export default function FoodLogs() {
    const router = useRouter();
    const userAuth = useContext(AuthContext);
    const [isUpdatelogOpen, setIsUpdateLogOpen] = useState(false);
    const [viewMode, setViewMode] = useState('week');
    const [showViewDropdown, setShowViewDropdown] = useState(false);
    const [dateOffset, setDateOffset] = useState(0);
    const [updatingLog, setupdatingLog] = useState(null);
    
    const viewDropdownRef = useRef(null);
    
    // Helper to convert YYYY-MM-DD to MM/DD/YYYY
    const formatDateForQuery = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    // Get date range based on view mode and offset
    const getDateRange = () => {
        const today = new Date();
        let startDate, endDate;

        switch(viewMode) {
            case 'day':
                const dayDate = new Date(today);
                dayDate.setDate(today.getDate() + dateOffset);
                startDate = endDate = dayDate;
                break;
            case 'week':
                const weekEnd = new Date(today);
                weekEnd.setDate(today.getDate() + (dateOffset * 7));
                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekEnd.getDate() - 6);
                startDate = weekStart;
                endDate = weekEnd;
                break;
            case 'month':
                const monthDate = new Date(today.getFullYear(), today.getMonth() + dateOffset, 1);
                startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                break;
            default:
                startDate = endDate = today;
        }

        return {
            startDate: formatDateForQuery(startDate.toISOString().split('T')[0]),
            endDate: formatDateForQuery(endDate.toISOString().split('T')[0])
        };
    };

    const { startDate, endDate } = getDateRange();

    // Format date range for display
    const formatDisplayDate = (dateStr, includeYear = false) => {
        const [month, day, year] = dateStr.split('/');
        const date = new Date(year, month - 1, day);
        const options = { month: 'short', day: 'numeric' };
        if (includeYear) {
            options.year = 'numeric';
        }
        return date.toLocaleDateString('en-US', options);
    };

    const getDateRangeDisplay = () => {
        if (viewMode === 'day') {
            return formatDisplayDate(startDate);
        } else if (viewMode === 'month') {
            // For month view, show "Month Year" format
            const [month, day, year] = startDate.split('/');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else { //week view
            const [startMonth, startDay, startYear] = startDate.split('/');
            const [endMonth, endDay, endYear] = endDate.split('/');
            

            return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
        }
    };

    const goToPrevious = () => {
        setDateOffset(dateOffset - 1);
    };

    const goToNext = () => {
        setDateOffset(dateOffset + 1);
    };

    const goToToday = () => {
        setDateOffset(0);
    };

    useEffect(() => {
        setDateOffset(0);
    }, [viewMode]);
    
    const { data: mealsData, loading: mealsLoading } = useQuery(GET_USER_MEALS);
    const [removeLog] = useMutation(REMOVE_FOOD_LOG);
  
    const { data: logsData, loading: logsLoading, refetch } = useQuery(GET_RANGED_FOOD_LOGS, {
        variables: { startDate, endDate }
    });
    
    useEffect(() => {
        if (userAuth.authLoaded && !userAuth.user) {
            router.push("/login");
        }
    }, [userAuth.authLoaded, userAuth.user, router]); 

    const handleDeleteLog = async (logId) => {
        try {
            await removeLog({
                variables: { logId }
            });
            // Refetch logs after deletion
            refetch();
        } catch (e) {
            console.error("Error deleting log:", e);
        }
    };

    const currentUser = userAuth.user;
    
    return (
        <>
            <div className="mx-4 mt-8">
                {/* Header with title and add button */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 -mb-3">
                        <h1 className={`text-4xl ${NimbusFont.className}`}>
                            {currentUser?.first_name ? currentUser.first_name + "'s" : ""} Logs
                        </h1>
                        
                        {/* View mode selector */}
                        <div className="flex items-center gap-2">
                            {/* View dropdown */}
                            <div className="relative" ref={viewDropdownRef}>
                                <button 
                                    onClick={() => setShowViewDropdown(!showViewDropdown)}
                                    className="px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 hover:opacity-80"
                                >
                                    <span>View: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
                                    <span>{showViewDropdown ? '▲' : '▼'}</span>
                                </button>
                                
                                {showViewDropdown && (
                                    <div className="absolute top-full mt-1 backdrop-blur-md bg-white/80 dark:bg-black/80 border rounded-lg shadow-lg z-10 min-w-full">
                                        <button
                                            onClick={() => {
                                                setViewMode('day');
                                                setShowViewDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:opacity-80 text-sm rounded-t-lg"
                                        >
                                            Day
                                        </button>
                                        <button
                                            onClick={() => {
                                                setViewMode('week');
                                                setShowViewDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:opacity-80 text-sm"
                                        >
                                            Week
                                        </button>
                                        <button
                                            onClick={() => {
                                                setViewMode('month');
                                                setShowViewDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:opacity-80 text-sm rounded-b-lg"
                                        >
                                            Month
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* Date navigation */}
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={goToPrevious}
                                    className="px-2 py-1 rounded hover:opacity-80 text-sm"
                                >
                                    ←
                                </button>
                                <button 
                                    onClick={goToToday}
                                    className="px-3 py-1.5 rounded-full border text-sm hover:opacity-80"
                                >
                                    {getDateRangeDisplay()}
                                </button>
                                <button 
                                    onClick={goToNext}
                                    className="px-2 py-1 rounded hover:opacity-80 text-sm"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        className="cursor-pointer text-lg px-4 py-2 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90 transition-all"
                        onClick={() => setIsUpdateLogOpen(true)}
                    >
                        Update Log +
                    </button>
                </div>

                <hr className="mb-4" />

                {/* Display food logs */}
                <div className="mt-4">
                    {logsLoading && <p>Loading logs...</p>}
                    {logsData?.getRangedFoodLogs?.length > 0 ? (
                        <div className="space-y-4">
                            {logsData.getRangedFoodLogs.map(log => (
                                <div key={log._id} className="border p-4 rounded-lg">
                                    <h3 className="font-bold text-lg">{log.date}</h3>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <p>Calories: {log.daily_total_calories}</p>
                                        <p>Protein: {log.daily_total_protein || 0}g</p>
                                        <p>Carbs: {log.daily_total_carbs || 0}g</p>
                                        <p>Fat: {log.daily_total_fat || 0}g</p>
                                    </div>
                                    <p className="mt-2 text-sm">Meals: {log.meals_logged?.length || 0}</p>
                                    {log.notes && <p className="mt-2 text-sm italic">{log.notes}</p>}
                                    
                                    <div className="mt-3 flex gap-2">
                                        <button 
                                            className="cursor-pointer bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg px-3 py-1 hover:opacity-90 transition-all"
                                            onClick={() => setupdatingLog(log)}
                                        >
                                            Update
                                        </button>
                                        <button 
                                            className="cursor-pointer border border-red-500 text-red-500 rounded-lg px-3 py-1 hover:opacity-80 transition-all"
                                            onClick={() => handleDeleteLog(log._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No logs found for this {viewMode}. Add a meal to get started!</p>
                    )}
                </div>
            </div>

            {/* Add meal modal */}
            {isUpdatelogOpen && (
                <AddFoodLog
                    meals={mealsData?.getMealsByUser || []}
                    onClose={() => setIsUpdateLogOpen(false)}
                    refetch={refetch}
                />
            )}

            {/* Edit meal modal */}
            {updatingLog && (
                <UpdateFoodLog
                    log={updatingLog}
                    meals={mealsData?.getMealsByUser || []}
                    onClose={() => setupdatingLog(null)}
                    refetch={refetch}
                />
            )}
        </>
    );
}