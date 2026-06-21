import { SlLike } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { toggleCommentLike, toggleMemoryLike } from "../../Redux/Slices/likeSlice";
import { useState } from "react";
import toast from "react-hot-toast";


function ToggleLike({ numberOfLikes, memoryId, commentId }){


    const [totalLikes, setTotalLikes] = useState(numberOfLikes);
    const dispatch = useDispatch();

    async function handleToggleLike(){
        toast.dismiss();
        // if(!memoryId && !commentId){
        //     toast.error("Invalid Like Request");
        //     return;
        // }
        let res;
        if(memoryId){
            res = await dispatch(toggleMemoryLike({ memoryId }));
        }else{
            res = await dispatch(toggleCommentLike({ commentId }));
        }
        setTotalLikes(res?.payload?.data?.numberOfLikes);
    }

    return(
        <button onClick={handleToggleLike}>
            <div className="flex justify-center items-center gap-2 hover:text-blue-400 ">
                <SlLike/> 
                <span>
                    {totalLikes}
                </span>
            </div>

        </button>
    )
}


export default ToggleLike;