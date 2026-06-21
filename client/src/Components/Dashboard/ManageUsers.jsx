import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersThunk } from "../../Redux/Slices/adminSlice";

function ManageUsers() {
    const users = useSelector((state) => state?.admin?.allUsers);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await dispatch(fetchAllUsersThunk());
                console.log("Users response : ", response);
            } catch (err) {
                console.error(`Error occurred while fetching users: ${err}`);
            }
        };
        fetchUsers();
    }, [dispatch]);

    return (
        <div className="min-h-screen w-[100vw] overflow-y-scroll bg-gray-100 dark:bg-gray-900 py-8 px-4">
            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {users?.map((user, ind) => (
                        <div
                            key={ind}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 border-solid border-2 border-black"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={user?.avatar?.secure_url || "https://www.google.com"} // Update with correct image URL
                                    alt="user dp"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-500"
                                />
                                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {user.username}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.numberOfMemories} Memories
                                </p>
                                <p className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${user.role == 'ADMIN' ? "text-red-700" : ""}`}>
                                    Role: {user.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default ManageUsers;
