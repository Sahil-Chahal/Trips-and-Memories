import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";

function BackButton() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleHomeClick = () => {
        navigate("/");
    }

    const handleExploreClick = () => {
        navigate("/memory/all");
    }

    return (
        <div className="fixed top-4 left-4 flex flex-row z-1">
            <button
                onClick={handleBackClick}
                className="flex items-center px-6 py-2 space-x-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all "
            >
                <FaArrowLeft className="text-lg" />
                <span className="hidden sm:inline">Back</span>
            </button>

            <button
                onClick={handleHomeClick}
                className='flex items-center px-6 py-2 space-x-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all'
            >
                <IoHomeOutline className='text-lg' />
                <span className='hidden sm:inline'>Home</span>
            </button>
            <button
                onClick={handleExploreClick}
                className='flex items-center px-6 py-2 space-x-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all'
            >
                <MdOutlineExplore className='text-lg' />
                <span className='hidden sm:inline'>Explore</span>
            </button>
        </div>
    );
}

export default BackButton;
