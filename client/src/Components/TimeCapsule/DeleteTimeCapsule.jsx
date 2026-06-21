import { useDispatch } from "react-redux";
import { deleteTimeCapsuleThunk } from "../../Redux/Slices/timeCapsuleSlice";
import { useNavigate } from "react-router-dom";

function DeleteTimeCapsule({ capsuleId }){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleDelete(){
        const res = await dispatch(deleteTimeCapsuleThunk({ capsuleId }));
        navigate("/time-capsules/fetch/my");
    }

    return(
        <>
            <button onClick={handleDelete} className="text-center text-white font-bold px-6 rounded-lg py-2 bg-red-500 hover:bg-red-700">
                Delete Capsule
            </button>
        </>
    )
}


export default DeleteTimeCapsule;