import { useDispatch } from "react-redux";
import { removeFriendThunk } from "../../Redux/Slices/friendshipSlice";


function RemoveFriend({ friendId }){

    const dispatch = useDispatch();

    async function handleRemovalOfFriend(){
        const res = await dispatch(removeFriendThunk({ friendId }));
        console.log("Response after removal of friend : ", res);
    }

    return(
        <button onClick={handleRemovalOfFriend} className="remove-button px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
            Remove Friend
        </button>
    )
}


export default RemoveFriend;