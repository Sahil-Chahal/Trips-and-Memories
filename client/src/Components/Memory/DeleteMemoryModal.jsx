import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteMemoryThunk } from "../../Redux/Slices/memorySlice.js";
import { useNavigate } from "react-router-dom";

function DeleteMemoryModal({ memoryId }) {
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    async function handleDeletionMemory(e){
        e.preventDefault();

        const res = await dispatch(deleteMemoryThunk({ memoryId }));
        navigate("/memory/my");
    }

    return (
        <div className="text-right p-4">
            <button
                onClick={openModal}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md dark:bg-red-600 dark:hover:bg-red-700 transition duration-300 shadow-md"
            >
                Confirm Delete
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
                    onClick={closeModal}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 transform duration-300 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center items-center border-b pb-4 mb-6 text-left">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Are you sure you want to delete this memory? This action cannot be undone!
                            </h3>
                        </div>

                        <form onSubmit={handleDeletionMemory} className="space-y-6">
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300 shadow-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-md"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteMemoryModal;
