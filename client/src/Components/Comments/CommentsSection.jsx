import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCommentsThunk, setMemoryId } from "../../Redux/Slices/commentSlice";
import { FaRegComments } from "react-icons/fa";
import Comment from "./Comment.jsx";
import AddComment from "./AddComment";

function CommentsSection({ memoryId }) {
    const dispatch = useDispatch();
    const commentsData = useSelector((state) => state?.comment?.comments);
    const [isExpanded, setIsExpanded] = useState(false);
    const [createCommentModal, setCreateCommentModal] = useState(false);

    function closeCreateCommentModal() {
        setCreateCommentModal(false);
    }

    function openCreateCommentModal() {
        setCreateCommentModal(true);
    }

    useEffect(() => {
        if (isExpanded) {
            dispatch(setMemoryId(memoryId));
            dispatch(fetchAllCommentsThunk({ memoryId }));
        }
    }, [isExpanded, dispatch, memoryId, commentsData.length]);

    const handleToggleComments = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="max-w-2xl mx-auto my-8">
            <div
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition"
                onClick={handleToggleComments}
            >
                <span className="text-lg font-semibold text-gray-700">Comments</span>
                <FaRegComments className="text-2xl text-gray-600" />
            </div>
            
            {isExpanded && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-4 space-y-6">
                    <button
                        onClick={openCreateCommentModal}
                        className="mb-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95"
                    >
                        Add Comment
                    </button>
                    {createCommentModal && (
                        <AddComment memoryId={memoryId} closeModal={closeCreateCommentModal} />
                    )}
                    {commentsData.length === 0 ? (
                        <h3 className="text-gray-500 text-center">No Comments Yet</h3>
                    ) : (
                        commentsData.map((comment) => (
                            <Comment
                                memoryId={memoryId}
                                key={comment._id}
                                avatarSrc={comment?.owner?.avatar?.secure_url}
                                ownerId={comment?.owner?._id}
                                ownerUserName={comment?.owner?.username}
                                content={comment?.content}
                                totalLikes={comment?.numberOfLikes || 0}
                                commentId={comment._id}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentsSection;
