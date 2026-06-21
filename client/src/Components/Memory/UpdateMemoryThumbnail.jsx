import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateThumbnailThunk } from "../../Redux/Slices/memorySlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UpdateMemoryThumbnail({ memoryId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [updatedThumbnail, setUpdatedThumbnail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    function handleThumbnailUpdation(e) {
        const updatedImage = e.target.files[0];
        setUpdatedThumbnail(updatedImage);
    }

    async function UpdateThumbnail(e) {
        e.preventDefault();
        if (!updatedThumbnail) {
            toast.error("Please upload a new thumbnail");
            return;
        }
        const formData = new FormData();
        formData.append("thumbnail", updatedThumbnail);
        await dispatch(updateThumbnailThunk({ memoryId, formData }));
        navigate("/memory/my");
        setUpdatedThumbnail("");
        closeModal();
    }

    return (
        <div className="text-right p-4">
            <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
                Update Thumbnail
            </button>


            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
                    onClick={closeModal} 
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 transition-transform transform duration-300 hover:scale-105"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Update Thumbnail
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 dark:text-gray-400 text-2xl hover:text-gray-900 dark:hover:text-white transition"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={UpdateThumbnail} className="flex flex-col justify-center items-center gap-6">
                            <input
                                type="file"
                                hidden
                                id="thumbnail-upload"
                                onChange={handleThumbnailUpdation}
                            />
                            <label htmlFor="thumbnail-upload" className="flex flex-col items-center cursor-pointer">
                                <FaCloudUploadAlt className="text-6xl text-blue-500 dark:text-blue-400 mb-2" />
                                <span className="text-gray-700 dark:text-gray-300">Upload New Thumbnail</span>
                            </label>
                            
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                            >   
                                Update Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateMemoryThumbnail;
