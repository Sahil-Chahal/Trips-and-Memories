import React, { useEffect, useState } from 'react';
import AllFriends from '../../Pages/Friends/AllFriends';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFriendsThunks } from '../../Redux/Slices/friendshipSlice';
import Friend from '../Friends/Friend';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addContributorThunk, fetchJournalContributorsThunk, removeContributorThunk } from '../../Redux/Slices/tripJournalSlice';
import toast from 'react-hot-toast';
import BackButton from '../BackButton';

function ManageContributors() {

    const [friendId, setFriendId] = useState("");
    const { journalId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let friendsList = useSelector((state) => state?.friendship?.friendsList) || [];
    let contributors = useSelector((state) => state?.tripJournal?.contributors) || [];
    const userData = useSelector((state) => state?.auth?.userData);

    async function fetchAllFriends(){
        const res = await dispatch(fetchAllFriendsThunks());
        console.log("Friends : ", res);
    }

    const handleAddContributor = async (e) => {
        e.preventDefault();
        toast.dismiss();
        if (!friendId) {
            toast.error("Friend Id is required !!");
            return;
        }
        setFriendId("");

        const res = await dispatch(addContributorThunk({ journalId, friendId }));
        if (res?.payload?.data?.statusCode !== 200) {
            navigate("/my-journals");
        }
        console.log("Add Contributor response : ", res);
    }

    const handleRemoveContributor = async (e) => {
        const friendId = e.target.id;
        e.preventDefault();
        toast.dismiss();
        const res = await dispatch(removeContributorThunk({ journalId, friendId }));
        console.log("Remove Contributor : ", res);
    }

    async function fetchContributors(){
        const res = await dispatch(fetchJournalContributorsThunk({ journalId }));
        console.log("Contributors : ", res);
    }

    useEffect(() => {
        fetchAllFriends();
        fetchContributors();
        console.log("Friendslist:", friendsList);
        console.log("contributors-redux : ", contributors);
    }, [])

    return (
        <section className='flex flex-col justify-center items-center px-6 py-8 bg-gray-100 dark:bg-gray-900 h-[100vh]'>
            <BackButton />
            <h1 className="text-center font-sans text-4xl font-extrabold my-6 text-blue-600 dark:text-blue-400">
                Manage Contributors
            </h1>
            {
                friendsList.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg dark:text-gray-400">
                        You don't have any friends yet! 🥲
                    </p>
                ) : (
                    <section className="flex flex-wrap flex-col justify-center items-center gap-4 bg-cyan-300 dark:bg-cyan-700 w-full md:w-[60vw] h-auto rounded-xl p-6 shadow-lg">
                        <h3 className='text-center text-blue-800 dark:text-blue-300 text-xl font-bold'>Your Friends</h3>
                        <div className="flex flex-col gap-4 w-full">
                            {
                                friendsList.map((ele) => (
                                    <Friend
                                        key={ele?._id}
                                        imgSrc={ele?.friend?.avatar?.secure_url}
                                        email={ele?.friend?.email}
                                        username={ele?.friend?.username}
                                        friendId={ele?.friend?._id}
                                        requestId={ele?.friend?._id}
                                        disableLink={true}
                                    />
                                ))
                            }
                        </div>
                    </section>
                )
            }
            <div className="flex flex-col lg:flex-row gap-8 w-full mt-10">
                <form onSubmit={handleAddContributor} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full lg:w-1/2 space-y-6">
                    <h2 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
                        Add Contributor
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="friend-unique-id"
                            className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
                        >
                            Friend ID
                        </label>
                        <input
                            type="text"
                            id="friend-unique-id"
                            value={friendId}
                            onChange={(e) => setFriendId(e.target.value)}
                            placeholder="Enter friend ID to add as a contributor"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Add Contributor
                    </button>
                    <p className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
                        * To add someone outside of your friends list, first add them as a friend from <Link to="/users/friends-list" className="text-blue-500 dark:text-blue-300 hover:underline">Manage Friends</Link>.
                    </p>
                </form>
                <section className="w-full lg:w-1/2 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <h1 className="text-center text-2xl font-serif text-gray-800 dark:text-white mb-6">
                        Current Contributors
                    </h1>
                    {
                        contributors.length === 0 ? (
                            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
                                No contributors yet! Add some to get started. 🚀
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-6 justify-center">
                                {
                                    contributors.map((ele, ind) => (
                                        <div
                                            key={ele?._id || Math.random()}
                                            className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md w-full max-w-lg transform hover:scale-105 transition duration-300"
                                        >
                                            <img
                                                src={ele?.avatar?.secure_url}
                                                alt="contributor-avatar"
                                                className="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600"
                                            />
                                            <div className="flex-grow">
                                                <p className={`font-semibold text-lg ${userData?._id === ele?._id ? "text-green-500" : "text-gray-800 dark:text-gray-200"}`}>
                                                    {ele?.username}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {ele?.email}
                                                </p>
                                            </div>
                                            <button
                                                className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition duration-200 ${userData?._id === ele?._id ? "hidden" : ""}`}
                                                id={ele?._id}
                                                onClick={handleRemoveContributor}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </section>
            </div>
        </section>
    );
}

export default ManageContributors;
