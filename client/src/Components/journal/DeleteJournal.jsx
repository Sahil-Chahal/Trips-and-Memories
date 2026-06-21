import { useDispatch } from "react-redux";
import axiosInstance from "../../Helpers/axiosInstance";
import { deleteJournalThunk } from "../../Redux/Slices/tripJournalSlice";


function DeleteJournal({ journalId }){

    const dispatch = useDispatch();
    
    async function handleDeleteJournal(){
        const res = await dispatch(deleteJournalThunk({ journalId }));
        console.log("Deleted journal res : ", res);
    }


    return(
        <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg " onClick={handleDeleteJournal}>
            Delete Journal
        </button>
    )
}


export default DeleteJournal;