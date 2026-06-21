import { MdOutlineBookmarkBorder } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toggleBucketListItemThunk } from "../../Redux/Slices/bucketListSlice";
import { toggleRefresh } from "../../Redux/Slices/bucketListSlice";

function ToggleBucketList({ memoryId }) {
    const dispatch = useDispatch();

    async function handleToggleBucketList() {
        await dispatch(toggleBucketListItemThunk({ memoryId }));
        dispatch(toggleRefresh());
    }

    return (
        <button title="toggle item to bucket list" onClick={handleToggleBucketList}>
            <MdOutlineBookmarkBorder className="text-2xl text-blue-500" />
        </button>
    );
}

export default ToggleBucketList;
