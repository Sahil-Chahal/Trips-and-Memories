// ViewMemory.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import BackButton from '../../Components/BackButton.jsx';
import { viewMemoryThunk } from '../../Redux/Slices/memorySlice.js';
import NavigationLayout from '../../Layouts/NavigationLayout.jsx';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import UpdateMemoryThumbnail from '../../Components/Memory/UpdateMemoryThumbnail.jsx';
import UpdateMemoryDetails from '../../Components/Memory/UpdateMemoryDetails.jsx';
import DeleteMemoryModal from '../../Components/Memory/DeleteMemoryModal.jsx';
import CommentsSection from '../../Components/Comments/CommentsSection.jsx';
import { FaRegShareSquare } from "react-icons/fa";
import ShareMemory from '../../Components/Memory/ShareMemory.jsx';

function ViewMemory() {
    const { memoryId } = useParams();
    const dispatch = useDispatch();
    const [memoryData, setMemoryData] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);

    const userId = useSelector((state) => state?.auth?.userData?._id);

    async function viewMemory() {
        const res = await dispatch(viewMemoryThunk({ memoryId }));
        setMemoryData(res?.payload?.data);
    }
    
    useEffect(() => {
        if (memoryData?.author === userId) {
            setIsAuthor(true);
        }
    }, [memoryData, userId]); 
    
    useEffect(() => {
        viewMemory();
    }, [dispatch, memoryId]);
    
    return (
        <NavigationLayout>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 flex flex-col items-center p-4">
                <div className="self-start mb-4">
                    {/* <BackButton /> */}
                </div>

                <div className="max-w-3xl w-full text-center">
                    <div className="relative overflow-hidden rounded-md mb-6 shadow-lg transform hover:scale-105 transition duration-300">
                        <img
                            src={memoryData?.thumbnail?.secure_url || '/placeholder-image.png'}
                            alt={memoryData?.title}
                            className="w-full h-80 object-cover"
                        />
                        {isAuthor && (
                            <UpdateMemoryThumbnail 
                                memoryId={memoryData?._id}
                                className="absolute bottom-4 right-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Update Thumbnail
                            </UpdateMemoryThumbnail>
                        )}
                    </div>

                    <div className="mb-4">
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                            {memoryData?.title}
                        </h1>
                        <div className="flex justify-center space-x-6 p-4 items-center font-mono tracking-widest text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span>{new Date(memoryData?.tripDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{memoryData?.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaTag className="text-green-500" />
                                <span>{memoryData?.category}</span>
                            </div>
                            <ShareMemory memoryId={memoryData?._id}/>
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed mb-8">
                        {memoryData?.content}
                    </p>

                    <div className="flex justify-between items-center mt-8 space-x-4 border-t pt-6 border-gray-300 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                                {memoryData?.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm font-medium">
                            <span className="font-semibold">{memoryData?.numberOfLikes}</span> {memoryData?.numberOfLikes === 1 ? 'Like' : 'Likes'}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center space-x-4">
                        {isAuthor && (
                            <>
                                <UpdateMemoryDetails
                                    memoryData={memoryData}
                                />
                                <DeleteMemoryModal
                                    memoryId={memoryData._id}
                                />

                            </>
                        )}
                    </div>
                    <div>
                        <CommentsSection memoryId={memoryData._id}/>
                    </div>
                </div>
            </div>
        </NavigationLayout>
    );
}

export default ViewMemory;
