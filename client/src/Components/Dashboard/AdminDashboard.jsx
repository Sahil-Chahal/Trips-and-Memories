import { useEffect, useState } from "react";
import { FaUsers, FaImages, FaThumbsUp, FaComments } from "react-icons/fa";
import { BsJournals } from "react-icons/bs";
import { FaBitbucket } from "react-icons/fa6";
import { LuTimer } from "react-icons/lu";
import { fetchUsersCount, fetchMemoriesCount, fetchTotalComments, fetchTotalLikes, fetchJournalCounts, fetchBucketListCounts, fetchTimeCapsuleCounts } from "../../Redux/Slices/adminSlice.js";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

function AdminDashboard() {

    const dispatch = useDispatch();

    const [ dataCounts, setDataCounts ] = useState({
        users : "loading..",
        memories : "loading..",
        likes : "loading..",
        comments : "loading..",
        journals : "loading..",
        buckets : "loading..",
        capsules : "loading.."
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    dispatch(fetchUsersCount()).unwrap().catch((err) => console.error("Users Count Error:", err)),
                    dispatch(fetchMemoriesCount()).unwrap().catch((err) => console.error("Memories Count Error:", err)),
                    dispatch(fetchTotalLikes()).unwrap().catch((err) => console.error("Likes Count Error:", err)),
                    dispatch(fetchTotalComments()).unwrap().catch((err) => console.error("Comments Count Error:", err)),
                    dispatch(fetchJournalCounts()).unwrap().catch((err) => console.error("Journals count : ", err)),
                    dispatch(fetchBucketListCounts()).unwrap().catch((err) => console.error("Bucket List Count : ", err)),
                    dispatch(fetchTimeCapsuleCounts()).unwrap().catch((err) => console.error("Time Capsules Error :" , err))

                ]);
                
                
                const users = results[0].status === "fulfilled" ? results[0].value : "Error";
                const memories = results[1].status === "fulfilled" ? results[1].value : "Error";
                const likes = results[2].status === "fulfilled" ? results[2].value : "Error";
                const comments = results[3].status === "fulfilled" ? results[3].value : "Error";
                const journals = results[4].status === "fulfilled" ? results[4].value : "Error";
                const buckets = results[5].status === "fulfilled" ? results[5].value : "Error";
                const capsules = results[6].status === "fulfilled" ? results[6].value : "Error";
    
    
                setDataCounts({
                    users,
                    memories,
                    likes,
                    comments,
                    journals,
                    buckets,
                    capsules
                });
                console.log("Data : ", results);
    
                if (results.every((result) => result.status === "fulfilled")) {
                    toast.success("Successfully fetched dashboard numbers!");
                } else {
                    toast.error("Some dashboard numbers could not be fetched.");
                }
            } catch (err) {
                toast.error("Error fetching dashboard numbers!");
                console.error(`Error occurred while fetching dashboard numbers: ${err}`);
                setDataCounts({
                    users: "Error",
                    memories: "Error",
                    likes: "Error",
                    comments: "Error",
                    journals : "Error",
                    buckets : " Error"
                });
            }
        };
    
        fetchData();
    }, [dispatch]);
    

    const stats = [
        {
            id: 1,
            title: "Total Users",
            value: dataCounts.users,
            icon: <FaUsers size={40} className="text-blue-500" />,
        },
        {
            id: 2,
            title: "Total Memories",
            value: dataCounts.memories,
            icon: <FaImages size={40} className="text-green-500" />,
        },
        {
            id: 3,
            title: "Total Likes",
            value: dataCounts.likes,
            icon: <FaThumbsUp size={40} className="text-yellow-500" />,
        },
        {
            id: 4,
            title: "Total Comments",
            value: dataCounts.comments,
            icon: <FaComments size={40} className="text-red-500" />,
        },
        {
            id : 5,
            title : "Total Journals",
            value : dataCounts.journals,
            icon :  <BsJournals size={40} className="text-slate-400" />
        },
        {
            id : 6,
            title : "Total Buckets",
            value : dataCounts.buckets,
            icon : <FaBitbucket size={40} className="text-cyan-500" />
        },
        {
            id : 7,
            title : "Total Time Capsules",
            value : dataCounts.capsules,
            icon : <LuTimer size={40} className="text-violet-500" />
        }
    ];
    

    return (
        <section className="w-full h-[100vh] flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                Dashboard Statistics
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:scale-105 transition-transform"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700">
                                {stat.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                                    {stat.title}
                                </h2>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AdminDashboard;
