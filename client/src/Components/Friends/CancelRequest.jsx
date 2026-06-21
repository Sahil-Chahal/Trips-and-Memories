import { useDispatch } from "react-redux"
import { cancelFriendRequestThunk } from "../../Redux/Slices/friendshipSlice";

function CancelRequest({ requestId }){

    const dispatch = useDispatch();

    async function  cancelFriendRequest(){
        const res = await dispatch(cancelFriendRequestThunk({ requestId }))
        console.log("Response from cancel friend request : ", res);
    }

    return(
        <button onClick={cancelFriendRequest} className="cancel-button px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200">
            Cancel Friend Request
        </button>
    )
}

export default CancelRequest;