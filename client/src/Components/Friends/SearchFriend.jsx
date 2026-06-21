import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearUsersData, fetchSearchedUserThunk } from "../../Redux/Slices/friendshipSlice";
import Friend from "./Friend.jsx";

function SearchFriend() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const dispatch = useDispatch();
    const usersData = useSelector((state) => state?.friendship?.usersData) || [];
    const totalPages = useSelector((state) => state?.friendship?.totalPages);

    const handleChangeInQuery = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (!val) {
            dispatch(clearUsersData());
        }
    };

    async function handleSearchUser(e) {
        e.preventDefault();
        toast.dismiss();

        if (!query) {
            toast.error("Search query not provided!!");
            return;
        }
        
        const res = await dispatch(fetchSearchedUserThunk({ page, limit, query }));
        console.log(res);
    }

    return (
        <section className="flex flex-col justify-center items-center gap-8">
            <div className="relative w-full max-w-md mb-6">
                <form onSubmit={handleSearchUser} className="w-full">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={handleChangeInQuery}
                            placeholder="Enter username to search..."
                            className="block w-full h-[50px] px-4 text-sm text-gray-900 bg-white rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-2xl text-gray-600 dark:text-gray-300"
                        >
                            <MdOutlineSearch />
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex flex-wrap justify-center items-start gap-6 w-full">
                {usersData?.length === 0 ? (
                    <p className="text-lg text-gray-600 dark:text-gray-400">No users found</p>
                ) : (
                    usersData?.map((ele) => (
                        <Friend
                            key={ele?.user?._id}
                            friendId={ele?.user?._id}
                            imgSrc={ele?.user?.avatar?.secure_url}
                            username={ele?.user?.username}
                            email={ele?.user?.email}
                            friendStatus={ele?.friendshipStatus}
                            requestId={ele?.requestId || "not-available"}
                            className="transition-transform transform hover:scale-105 hover:shadow-lg rounded-xl"
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default SearchFriend;
