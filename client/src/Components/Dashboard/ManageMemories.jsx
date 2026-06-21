import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMemoriesThunk } from "../../Redux/Slices/adminSlice";

function ManageMemories() {
    const memories = useSelector((state) => state?.admin?.allMemories);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMemories = async () => {
            const res = await dispatch(fetchAllMemoriesThunk());
            // console.log("Response is here : ", res);
        };
        fetchMemories();
    }, [dispatch]);

    return (
        <div className="h-screen overflow-y-scroll w-[100vw] bg-gray-100 dark:bg-gray-800 py-8 px-4">
            <section className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Manage Memories
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memories?.map((memory, ind) => (
                        <div
                            key={ind}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-dotted border-2 hover:shadow-xl transition-shadow duration-200"
                        >
                            <img
                                src={memory.thumbnail.secure_url}
                                alt={memory.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {memory.title}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <span className="text-orange-300">
                                        {memory.location} {" "}
                                    </span>
                                    |{" "}
                                    <span className="text-blue-700">
                                        {new Date(memory.tripDate).toLocaleDateString()}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <strong>Author:</strong> {memory?.author?.username || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {memory.content}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {memory.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Category: <strong className="text-green-400">{memory.category}</strong>
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Likes: <strong className="text-red-200">{memory.numberOfLikes}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default ManageMemories;
