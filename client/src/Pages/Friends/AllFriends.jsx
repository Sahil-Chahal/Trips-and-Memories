import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFriendsThunks } from "../../Redux/Slices/friendshipSlice";
import BackButton from "../../Components/BackButton";
import SearchFriend from "../../Components/Friends/SearchFriend";
import Friend from "../../Components/Friends/Friend";
import PendingRequests from "../../Components/Friends/PendingRequests";

function AllFriends() {

    const dispatch = useDispatch();
    const friendsList = useSelector((state) => state?.friendship?.friendsList) || []
    const refreshKey = useSelector((state) => state?.friendship?.refreshKey);

    async function fetchAllFriends(){
        const res = await dispatch(fetchAllFriendsThunks());
    }

    useEffect(() => {
        fetchAllFriends();
    }, [refreshKey])

    return (
        <div className="all-friends-container flex flex-col justify-center items-center h-[150vh] px-8 py-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            <BackButton />
            <h1 className="text-5xl font-extrabold tracking-wide text-center mb-6 text-gray-800 dark:text-white">
                All Friends
            </h1>
            {
                friendsList.length === 0 ? (
                    <p className="text-lg bg-gray-200 dark:bg-gray-700 rounded-md p-4 shadow-lg mb-6 text-center">
                        You haven't added any friends yet
                    </p>
                ) : (
                    <div className="friends-list w-full max-w-3xl mt-6 space-y-6">
                        {
                            friendsList.map((ele) => 
                            <Friend
                                key={ele?._id}
                                imgSrc={ele?.friend?.avatar?.secure_url}
                                friendId={ele?.friend?._id}
                                friendStatus={ele?.friendshipStatus}
                                username={ele?.friend?.username}
                                email={ele?.friend?.email}
                                name={ele?.friend?.name}
                            />
                            )
                        }
                    </div>
                )
            }
            <section className="flex flex-wrap justify-center items-center gap-8 mt-10 w-full max-w-screen-xl">
                <section className="pending-requests-section w-full sm:w-1/2 bg-slate-300 dark:bg-slate-700 p-6 rounded-xl shadow-lg overflow-y-auto">
                    <PendingRequests />
                </section>
                
                <section className="search-friend-section w-full sm:w-1/2 bg-gray-200 dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-y-auto">
                    <SearchFriend />
                </section>
            </section>
        </div>
    );
}

export default AllFriends;
