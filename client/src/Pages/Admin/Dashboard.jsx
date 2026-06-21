import { useState } from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "../../Components/Dashboard/AdminDashboard";
import ManageUsers from "../../Components/Dashboard/ManageUsers";
import Analytics from "../../Components/Dashboard/Analytics";
import { useNavigate } from "react-router-dom";
import ManageMemories from "../../Components/Dashboard/ManageMemories";

function Dashboard() {
    const [currentView, setCurrentView] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for toggling sidebar on smaller screens
    const navigate = useNavigate();

    const userData = useSelector((state) => state?.auth?.userData);

    const renderContent = () => {
        switch (currentView) {
            case "Dashboard":
                return <AdminDashboard />;
            case "Users":
                return <ManageUsers />;
            case "Memories":
                return <ManageMemories/>
            case "Analytics":
                return <Analytics />;
            default:
                return <h1 className="text-2xl font-bold text-center">Select a Section</h1>;
        }
    };

    return (
        <div className="h-[100vh] flex flex-col lg:flex-row dark:bg-gray-900">

            <aside
                className={`${
                    sidebarOpen ? "block" : "hidden"
                } lg:block w-full lg:w-1/6 bg-gray-100 dark:bg-gray-800 p-4 lg:relative fixed top-0 left-0 h-full z-20`}
            >
                <h2 className="px-4 py-2 mb-2 flex flex-col justify-center items-center dark:text-white text-xl dark:bg-black rounded-lg">
                    Welcome<span className="text-blue-600 font-bold">{userData.username}</span>
                </h2>
                <nav className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 text-left rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white"
                    >
                        Home
                    </button>
                    <button
                        className={`p-2 text-left rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white ${
                            currentView === "Dashboard" ? "bg-gray-300 dark:bg-gray-700" : ""
                        }`}
                        onClick={() => setCurrentView("Dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`p-2 text-left rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white ${
                            currentView === "Users" ? "bg-gray-300 dark:bg-gray-700" : ""
                        }`}
                        onClick={() => setCurrentView("Users")}
                    >
                        Users
                    </button>
                    <button
                        className={`p-2 text-left rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white ${
                            currentView === "Memory" ? "bg-gray-300 dark:bg-gray-700" : ""
                        }`}
                        onClick={() => setCurrentView("Memories")}
                    >
                        Memories
                    </button>
                    <button
                        className={`p-2 text-left rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white ${
                            currentView === "Analytics" ? "bg-gray-300 dark:bg-gray-700" : ""
                        }`}
                        onClick={() => setCurrentView("Analytics")}
                    >
                        Analytics
                    </button>
                </nav>
            </aside>


            <button
                className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-blue-500 text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? "Close" : "Menu"}
            </button>

            {/* Main Content */}
            <main className="w-full lg:w-5/6 h-full flex justify-center items-center p-4">
                {renderContent()}
            </main>
        </div>
    );
}

export default Dashboard;
