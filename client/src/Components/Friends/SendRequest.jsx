import { useDispatch } from "react-redux";
import { sendFriendRequestThunk } from "../../Redux/Slices/friendshipSlice";
import { useState } from "react";

function SendRequest({ friendId }){

    const dispatch = useDispatch();
    // const [recipientId, setRecipientId] = useState(friendId || "");

    async function handleSendFriendRequest(){
        console.log("Sending friend request...");
        const res = await dispatch(sendFriendRequestThunk({ recipientId : friendId }));
        console.log("Response : ",res);
    }

    return(
        <>
            <button onClick={handleSendFriendRequest} className="send-request-button px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                Send Friend Request
            </button>
        </>
    )
}

export default SendRequest;