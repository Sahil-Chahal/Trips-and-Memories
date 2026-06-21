import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCommentThunk } from "../../Redux/Slices/commentSlice";

function AddComment({ closeModal, memoryId }) {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState("");

    async function handleAddComment(e) {
        e.preventDefault();
        await dispatch(createCommentThunk({ memoryId, content: commentText }));
        closeModal();
        setCommentText("");
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg relative max-w-md w-full">
                <button
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={closeModal}
                >
                    ✕
                </button>
                <h1 className="text-center text-2xl uppercase tracking-wider font-serif font-bold text-gray-800 mb-4">
                    Add Comment
                </h1>
                <p className="text-center text-gray-600 mb-4">
                    Share your thoughts about this memory
                </p>
                <form onSubmit={handleAddComment} className="flex flex-col gap-4 justify-center items-center">
                    <textarea
                        name="content"
                        placeholder="Enter new comment here"
                        className="border border-solid border-gray-300 rounded-lg w-full h-24 p-2 dark:text-black focus:outline-none focus:border-blue-500 transition-colors"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
                        type="submit"
                    >
                        Add Comment
                    </button>
                    <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-full py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddComment;
