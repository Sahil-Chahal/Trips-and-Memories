import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import RemoveFriend from "../../Components/Friends/RemoveFriend";
import SendRequest from "../../Components/Friends/SendRequest";
import { useDispatch } from "react-redux";
import { fetchMyProfile } from "../../Redux/Slices/authSlice";
import CancelRequest from "../../Components/Friends/CancelRequest";
import { fetchAuthorMemoriesThunk } from "../../Redux/Slices/memorySlice";
import MemoryCard from "../../Components/Memory/MemoryCard.jsx";



function FriendProfile() {

    const { friendId, friendStatus } = useParams();
    const [ friendMemories, setFriendMemories ] = useState([]);
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const requestId = queryParams.get("requestId");

    const [ friendData, setFriendData ] = useState({
        imgSrc : "",
        username : "",
        email : "",
        name : "",
        isFriend : ""
    })

    async function fetchFriendProfile(){
        const res = await dispatch(fetchMyProfile({ userId : friendId }));
        console.log("Friend Profile Data : ", res);
        setFriendData({
            imgSrc : res?.payload?.data?.avatar?.secure_url,
            username : res?.payload?.data?.username,
            email : res?.payload?.data?.email,
            name : res?.payload?.data?.name
        })
    }

    async function fetchAuthorMemories(){
        const res = await dispatch(fetchAuthorMemoriesThunk({ authorId : friendId }));
        setFriendMemories(res?.payload?.data);
        console.log("friends memories : ", res);
    }

    useEffect(() => {
        fetchFriendProfile();
        fetchAuthorMemories;
    }, [])


    return (
        <main className=" max-w-md mx-auto my-8 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <section className="flex flex-col items-center text-center">
                <div className="avatar-container flex justify-center items-center w-[100px] h-[100px] overflow-hidden rounded-full border-4 border-gray-300 mb-4">
                    <img
                        src={friendData?.imgSrc || "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{friendData?.name || "John Doe"}</h1>
                <p className="text-gray-600 dark:text-gray-300">{friendData?.username || "@johndoe"}</p>
                <p className="text-gray-500 dark:text-gray-400">{friendData?.email || "someone@example.com"}</p>
                
                <div className="flex justify-center items-center ">
                    {friendStatus === "requestSent" && (
                        <CancelRequest requestId={requestId} />
                    )}
                    {friendStatus === "friend" && (
                        <RemoveFriend friendId={friendId}/>
                    )}
                    {friendStatus === "none" && (
                        <SendRequest friendId={friendId} />
                    )}

                </div>

            </section>

            <section className="memories-section mt-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Memories</h2>
                {
                    friendMemories.length == 0 ? (
                        <div className="memories-placeholder p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            <p>No Memories available yet. Check back soon!</p>
                        </div>
                    ) : (
                        friendMemories.map((ele, ind) => {
                            return <MemoryCard memory={ele} key={ind}/>
                        })
                    )
                }
            </section>
        </main>
    );
}

export default FriendProfile;
