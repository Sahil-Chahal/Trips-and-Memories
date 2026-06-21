import React, { useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchCategoryStatsThunk,
    fetchMemoryEngagementStatsThunk,
    fetchMemoryStatsThunk,
    fetchPopularLocationsThunk,
    fetchUserEngagementStatsThunk,
    fetchUserGrowthStatsThunk,
} from "../../Redux/Slices/adminSlice";
import toast from "react-hot-toast";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

function Analytics() {
    const dispatch = useDispatch();

    // Access Redux state
    const {
        categoryStats,
        memoryStats,
        locationStats,
        userEngagementStats,
        userGrowthStats,
        memoryEngagementStats,
    } = useSelector((state) => state.admin);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    dispatch(fetchCategoryStatsThunk()),
                    dispatch(fetchMemoryStatsThunk()),
                    dispatch(fetchPopularLocationsThunk()),
                    dispatch(fetchUserEngagementStatsThunk()),
                    dispatch(fetchUserGrowthStatsThunk()),
                    dispatch(fetchMemoryEngagementStatsThunk()),
                ]);
                console.log("Result of analytics : ", results);

                if (results.every((result) => result.status === "fulfilled")) {
                    toast.success("Successfully fetched dashboard analytics!");
                } else {
                    toast.error("Some dashboard analytics could not be fetched!");
                }
            } catch (err) {
                toast.error("Error fetching dashboard analytics!");
                console.error(`Error occurred while fetching Dashboard analytics: ${err}`);
            }
        };

        fetchData();
    }, [dispatch]);

    const categoryData = {
        labels: categoryStats?.map((item) => item.category) || [],
        datasets: [
            {
                label: "Category Count",
                data: categoryStats?.map((item) => item.count) || [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
            },
        ],
    };

    const memoryOverTimeData = {
        labels: memoryStats?.map((item) => item.date) || [],
        datasets: [
            {
                label: "Memories Over Time",
                data: memoryStats?.map((item) => item.count) || [],
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 2,
            },
        ],
    };

    const popularLocationsData = {
        labels: locationStats?.map((item) => item.location) || [],
        datasets: [
            {
                label: "Popular Locations",
                data: locationStats?.map((item) => item.count) || [],
                backgroundColor: [
                    "rgba(255,99,132,0.6)",
                    "rgba(54,162,235,0.6)",
                    "rgba(255,206,86,0.6)",
                    "rgba(75,192,192,0.6)",
                    "rgba(153,102,255,0.6)",
                ],
                borderColor: [
                    "rgba(255,99,132,1)",
                    "rgba(54,162,235,1)",
                    "rgba(255,206,86,1)",
                    "rgba(75,192,192,1)",
                    "rgba(153,102,255,1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    const userEngagementGrowth = {
        labels: userEngagementStats?.map((stat) => stat.date) || [],
        datasets: [
            {
                label: "Memories",
                data: userEngagementStats?.map((stat) => stat.memoryCount) || [],
                borderColor: "#36a2eb",
                fill: false,
            },
            {
                label: "Likes",
                data: userEngagementStats?.map((stat) => stat.likeCount) || [],
                borderColor: "#ff6384",
                fill: false,
            },
            {
                label: "Comments",
                data: userEngagementStats?.map((stat) => stat.commentCount) || [],
                borderColor: "#4caf50",
                fill: false,
            },
        ],
    };

    const userGrowthGraph = {
        labels: userGrowthStats?.map((stat) => stat._id) || [],
        datasets: [
            {
                label: "User Growth",
                data: userGrowthStats?.map((stat) => stat.count) || [],
                borderColor: "#ffc107",
                fill: false,
            },
        ],
    };

    const memoryEngagementGraph = {
        labels: ["Average Likes", "Average Comments"],
        datasets: [
            {
                label: "Memory Engagement Stats",
                data: [
                    memoryEngagementStats?.averageLikesPerMemory || 0,
                    memoryEngagementStats?.averageCommentsPerMemory || 0,
                ],
                backgroundColor: ["#36a2eb", "#ff6384"],
            },
        ],
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 h-screen flex flex-col items-center gap-8 py-8 overflow-y-scroll w-screen">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Analytics Dashboard</h1>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Category Stats</h2>
                <div className="h-[400px]">
                    <Bar data={categoryData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Memories Over Time</h2>
                <div className="h-[400px]">
                    <Line data={memoryOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Popular Locations</h2>
                <div className="h-[400px]">
                    <Pie data={popularLocationsData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">User Engagement Stats</h2>
                <div className="h-[400px]">
                    <Line data={userEngagementGrowth} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">User Growth Stats</h2>
                <div className="h-[400px]">
                    <Line data={userGrowthGraph} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Memory Engagement Stats</h2>
                <div className="h-[400px]">
                    <Bar data={memoryEngagementGraph} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}

export default Analytics;
