// UpdateMemoryDetails.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateMemoryDetailsThunk } from "../../Redux/Slices/memorySlice";

function UpdateMemoryDetails({ memoryData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [updatedMemoryData, setUpdatedMemoryData] = useState({
        title: memoryData?.title,
        content: memoryData?.content,
        category: memoryData?.category,
        location: memoryData?.location,
        tags: memoryData?.tags || [],
    });
    const [newTag, setNewTag] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    function handleDataUpdation(e) {
        const { name, value } = e.target;
        setUpdatedMemoryData({ ...updatedMemoryData, [name]: value });
    }

    function handleAddTag() {
        if (newTag.trim() && !updatedMemoryData.tags.includes(newTag.trim())) {
            setUpdatedMemoryData({
                ...updatedMemoryData,
                tags: [...updatedMemoryData.tags, newTag.trim()],
            });
            setNewTag("");
        }
    }

    function handleRemoveTag(tagToRemove) {
        setUpdatedMemoryData({
            ...updatedMemoryData,
            tags: updatedMemoryData.tags.filter(tag => tag !== tagToRemove),
        });
    }

    async function handleMemoryUpdation(e) {
        e.preventDefault();
        toast.dismiss();
        
        if (!updatedMemoryData.title && !updatedMemoryData.category && !updatedMemoryData.content && !updatedMemoryData.location && !updatedMemoryData.tags.length) {
            toast.error("At least one field is required!");
            return;
        }
    
        const formData = new FormData();
        formData.append("title", updatedMemoryData.title);
        formData.append("category", updatedMemoryData.category);
        formData.append("content", updatedMemoryData.content);
        formData.append("location", updatedMemoryData.location);
    
        updatedMemoryData.tags.forEach(tag => {
            formData.append("tags[]", tag); 
        });
    
        const memoryId = memoryData._id;
        const res = await dispatch(updateMemoryDetailsThunk({ memoryId, formData }));
        console.log("Updation of memory response: ", res);
        navigate("/memory/my");
        closeModal();
    }
    

    return (
        <div className="text-right p-4">
            <button
                onClick={openModal}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-md dark:bg-green-600 dark:hover:bg-green-700 transition duration-300 shadow-md"
            >
                Update Memory
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl p-8 transform duration-300 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Update Memory
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 dark:text-gray-400 text-2xl hover:text-gray-900 dark:hover:text-white transition"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleMemoryUpdation} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label htmlFor="title" className="text-lg font-medium text-gray-800 dark:text-gray-300">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={updatedMemoryData.title}
                                        onChange={handleDataUpdation}
                                        id="title"
                                        className="w-full mt-1 p-3 border rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="location" className="text-lg font-medium text-gray-800 dark:text-gray-300">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={updatedMemoryData.location}
                                        onChange={handleDataUpdation}
                                        id="location"
                                        className="w-full mt-1 p-3 border rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="category" className="text-lg font-medium text-gray-800 dark:text-gray-300">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={updatedMemoryData.category}
                                        onChange={handleDataUpdation}
                                        id="category"
                                        className="w-full mt-1 p-3 border rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Emotional">Emotional</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Horror">Horror</option>
                                        <option value="Funky">Funky</option>
                                        <option value="Cute">Cute</option>
                                        <option value="Romantic">Romantic</option>
                                        <option value="Spiritual">Spiritual</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Foodie">Foodie</option>
                                        <option value="Wildlife">Wildlife</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="tags" className="text-lg font-medium text-gray-800 dark:text-gray-300">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            className="flex-grow p-3 border rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
                                        >
                                            Add Tag
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {updatedMemoryData.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full text-sm flex items-center">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="content" className="text-lg font-medium text-gray-800 dark:text-gray-300">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={updatedMemoryData.content}
                                    onChange={handleDataUpdation}
                                    id="content"
                                    rows="6"
                                    className="w-full mt-1 p-3 border rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300 shadow-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateMemoryDetails;
