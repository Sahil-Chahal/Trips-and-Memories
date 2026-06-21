import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllMemoriesThunk, fetchSearchMemoriesThunk } from '../../Redux/Slices/memorySlice.js';
import MemoryCard from '../../Components/Memory/MemoryCard.jsx';
// import BackButton from '../../Components/BackButton.jsx';
import NavigationLayout from '../../Layouts/NavigationLayout.jsx';
import SearchMemory from '../../Components/Memory/SearchMemory.jsx';


function AllMemories() {
    const dispatch = useDispatch();
    const [allMemoriesData, setAllMemoriesData] = useState();
    const [limit] = useState(6); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fetchAll, setFetchAll] = useState(false);

    const handleForwardNavigation = () => {
        if(page < totalPages) {
            setPage((prev) => prev + 1);
        }
    }

    const handleBackwardPagination = () => {
        if(page > 1) {
            setPage((prev) => prev - 1);
        }
    }
    async function fetchAllMemories() {
        const res = await dispatch(fetchAllMemoriesThunk({ page, limit }));
        setAllMemoriesData(res?.payload?.data);
        setTotalPages(res?.payload?.data?.totalPages);
        setFetchAll(false);
    }

    async function fetchSearchQuery(query){
        const res = await dispatch(fetchSearchMemoriesThunk({ page, limit, query }));
        // console.log(res);
        setAllMemoriesData(res?.payload?.data);
        setTotalPages(res?.payload?.data?.totalPages);
    }
    
    useEffect(() => {
        if(fetchAll){
            fetchAllMemories();
        }else{
            fetchAllMemories();
        }
    }, [dispatch, page, limit, fetchAll]);

    return (
        <NavigationLayout>
            <div className="container min-h-screen w-full flex flex-col justify-center items-center gap-4 mx-auto p-4 pb-8 bg-white dark:bg-gray-900">
                {/* <BackButton /> */}

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                        All Memories
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Explore the memories shared by everyone
                    </p>
                    <div className='w-[500px]'>
                        <SearchMemory onSearch={fetchSearchQuery} setFetchAll={setFetchAll} />
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-wrap gap-6 max-w-6xl justify-center">
                        {allMemoriesData?.allMemories.length > 0 ? (
                            allMemoriesData.allMemories.map(memory => (
                                <MemoryCard 
                                    key={memory._id} 
                                    memory={memory} 
                                    className="flex-none w-80"
                                />
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">
                                No memories found.
                            </p>
                        )}
                    </div>
                </div>



                <div className="flex justify-center items-center mt-10 space-x-4">
                    <button
                        onClick={handleBackwardPagination}
                        disabled={page === 1}
                        className={`px-6 py-2 text-white rounded-md shadow-md ${
                            page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleForwardNavigation}
                        disabled={page >= totalPages}
                        className={`px-6 py-2 text-white rounded-md shadow-md ${
                            page === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </NavigationLayout>
    );
}

export default AllMemories;
