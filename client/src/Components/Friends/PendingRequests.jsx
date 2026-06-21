import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingRequestsThunk } from "../../Redux/Slices/friendshipSlice";
import Friend from "./Friend";


function PendingRequests(){

    const dispatch = useDispatch();
    const pendingRequests = useSelector((state) => state?.friendship?.pendingRequests) || [];
    console.log("pendingrequests : ", pendingRequests);

    async function fetchPendingRequests(){
        console.log("hello");
        const res = await dispatch(fetchPendingRequestsThunk());
        console.log("Here is the response : ", res);
    }   

    useEffect(() => {
        fetchPendingRequests();
        
    }, [])


    return(
        <>
            <section className="flex justify-center items-center gap-4">
                {
                    pendingRequests.length === 0 ? (
                        <h2 className="text-center font-serif text-xl">
                            Pending Requests will be shown here
                        </h2>
                    ) : (
                        pendingRequests.map((ele) => {
                            return <Friend 
                                imgSrc={ele?.requester?.avatar?.secure_url}
                                key={ele?.requester?._id}
                                username={ele?.requester?.name}
                                email={ele?.requester?.email}
                                friendStatus={ele?.friendshipStatus}
                                friendId={ele?.requester?._id}
                                requestId={ele?.requestId}
                            />
                        })
                    )
                }
            </section>  
        </>
    )
}

export default PendingRequests;