import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPersonalMemoriesThunk } from '../../Redux/Slices/memorySlice.js';
import MemoryCard from '../../Components/Memory/MemoryCard.jsx';
import BackButton from '../../Components/BackButton.jsx';

function PersonalMemories() {
    const dispatch = useDispatch();
    const [personalMemoriesData, setPersonalMemoriesData] = useState({ personalMemories: [], totalPages: 1 });
    const [limit] = useState(3);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchPersonalMemories() {
            const res = await dispatch(fetchPersonalMemoriesThunk({ page, limit }));
            setPersonalMemoriesData(res?.payload?.data || { personalMemories: [], totalPages: 1 });
        }
        fetchPersonalMemories();
    }, [dispatch, page, limit]);

    return (
        <div className="container h-screen flex flex-col justify-center items-center gap-4 mx-auto p-4 bg-white dark:bg-gray-900">
            <BackButton />

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    My Personal Memories
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Cherish the moments you want to remember forever
                </p>
            </div>

            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {personalMemoriesData?.personalMemories?.length > 0 ? (
                        personalMemoriesData.personalMemories.map(memory => (
                            <MemoryCard key={memory._id} memory={memory} />
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">
                            No personal memories found.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-6 py-2 text-white rounded-md shadow-md ${
                        page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, personalMemoriesData.totalPages))}
                    disabled={page === personalMemoriesData.totalPages}
                    className={`px-6 py-2 text-white rounded-md shadow-md ${
                        page === personalMemoriesData.totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PersonalMemories;
