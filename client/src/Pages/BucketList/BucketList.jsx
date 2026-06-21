import { useDispatch, useSelector } from "react-redux";
import NavigationLayout from "../../Layouts/NavigationLayout";
import { useNavigate } from "react-router-dom";
// import BackButton from "../../Components/BackButton";
import { useEffect, useState } from "react";
import MemoryCard from "../../Components/Memory/MemoryCard";
import { clearBucketListThunk, getBucketListThunk } from "../../Redux/Slices/bucketListSlice";
import { toggleRefresh } from "../../Redux/Slices/bucketListSlice";
import toast from "react-hot-toast";

function BucketList() {
    
    
    const [bucketListData, setBucketListData] = useState([]);
    const [limit] = useState(2);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth?.userData);
    const refreshToggle = useSelector((state) => state?.bucketList?.refreshToggle);
    
    async function fetchBucketListItems() {
        const res = await dispatch(getBucketListThunk({ page, limit }));
        setBucketListData(res?.payload?.data?.fullBucketList);
        setTotalPages(res?.payload?.data?.totalPages);
        setTotalItems(res?.payload?.data?.totalItems);
        console.log("response : ", res);
    }
    
    useEffect(() => {
        fetchBucketListItems();
    }, [dispatch, page, limit, refreshToggle]);

    const handleForwardNavigation = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const clearFullBucketList = async () => {
        if(totalItems === 0){
            toast.dismiss();
            toast.error("Bucket List already empty !!");
            return;
        }
        await dispatch(clearBucketListThunk());
        dispatch(toggleRefresh());
    }

    const handleBackwardNavigation = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    return (
        <NavigationLayout>
            <div className="container min-h-screen w-full flex flex-col justify-center items-center gap-4 mx-auto p-4 pb-8 bg-white dark:bg-gray-900">
                {/* <BackButton /> */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        <span className="capitalize">{userData?.name}'s </span>
                        Bucket List
                    </h1>
                    <p className="dark:text-slate-400">Explore Your Bucket List</p>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-wrap gap-6 max-w-6xl justify-center">
                        {bucketListData.length > 0 ? (
                            bucketListData.map((memory) => (
                                <MemoryCard
                                    key={memory._id}
                                    memory={memory.memory}
                                    className="flex-none w-80"
                                />
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">
                                No Items found in Bucket List
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center mt-10 space-x-4">
                    <button
                        onClick={handleBackwardNavigation}
                        disabled={page === 1}
                        className={`px-6 py-2 text-white rounded-md shadow-md ${
                            page === 1
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={clearFullBucketList} 
                        disabled={totalItems === 0}
                        className={`px-6 py-2 text-white rounded-md shadow-md ${totalItems === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} dark:bg-red-600 dark:hover:bg-red-700`}>
                        Empty Bucket List
                    </button>
                    <button
                        onClick={handleForwardNavigation}
                        disabled={page == totalPages}
                        className={`px-6 py-2 text-white rounded-md shadow-md ${
                            page >= totalPages
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </NavigationLayout>
    );
}

export default BucketList;
