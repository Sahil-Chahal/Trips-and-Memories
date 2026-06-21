import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTripStoryThunk } from "../../Redux/Slices/tripJournalSlice";


function AddTripStory({ journalId }){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function generateTripStory(){
        const res = await dispatch(addTripStoryThunk({ journalId }));
        console.log("Trip story : ", res);
        navigate(`/my-journals`);
    }

    return(
        <>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-800" onClick={generateTripStory}>
                ✨Generate Ai Trip Story✨
            </button>
        </>
    )
}


export default AddTripStory;

