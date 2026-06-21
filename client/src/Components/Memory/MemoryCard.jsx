// MemoryCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaHeart, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import ToggleBucketList from '../BucketList/ToggleBucketList';
import ToggleLike from '../Like/ToggleLike';

function MemoryCard({ memory }) {
    return (
        <div className="memory-card w-80 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
            <div>
                <Link to={`/memory/${memory._id}`}>
                    <img src={memory.thumbnail?.secure_url} alt={memory.title} className="memory-thumbnail w-full h-48 object-cover" />
                </Link>
            </div>

            <div className="p-4">
                <Link to={`/memory/${memory._id}`} className="hover:text-blue-600">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-cyan-500">
                        {memory.title}
                    </h3>
                </Link>

                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-red-500" /> {memory.location}
                    </span>
                    <span className="flex items-center">
                        <FaTag className="mr-1 text-green-500" /> {memory.category}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <ToggleLike memoryId={memory._id} numberOfLikes={memory.numberOfLikes}/>
                    </span>


                    <ToggleBucketList memoryId={memory._id} />

                    <span className="flex items-center font-mono tracking-widest text-gray-500 dark:text-gray-400">
                        <FaCalendarAlt className="mr-1 text-blue-500" /> {new Date(memory.tripDate).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MemoryCard;
