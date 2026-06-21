import { useDispatch } from "react-redux";
import { closeJournalThunk } from "../../Redux/Slices/tripJournalSlice";

function CloseJournal({ journalId }) {
    const dispatch = useDispatch();

    async function handleCloseJournal() {
        const res = await dispatch(closeJournalThunk({ journalId }));
        console.log("Closed journal response: ", res);
    }

    return (
        <button
            className="px-4 py-2 bg-red-600 text-white rounded-bl-xl rounded-br-xl font-semibold hover:bg-red-500 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700 transition-all shadow-md"
            onClick={handleCloseJournal}
        >
            Close Journal
        </button>
    );
}

export default CloseJournal;
