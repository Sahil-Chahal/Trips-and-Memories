import { SlLike } from "react-icons/sl";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import DeleteComment from "./DeleteComment";
import ToggleLike from "../Like/ToggleLike";

function Comment({ avatarSrc, ownerId, ownerUserName, commentId, content, totalLikes, memoryId }) {
    const [showModal, setShowModal] = useState(false);
    const userData = useSelector((state) => state?.auth?.userData);

    const openDeleteModal = () => setShowModal(true);
    const closeDeleteModal = () => setShowModal(false);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg">
            <div className="flex items-start space-x-4">
                <img src={avatarSrc || "https://example.com/default-avatar.jpg"} alt="User avatar" className="w-10 h-10 rounded-full border border-gray-300 object-cover" />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className="text-md font-semibold text-blue-700 dark:text-blue-400 capitalize">{ownerUserName || "John Doe"}</h4>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center text-gray-500 hover:text-blue-600 transition-colors space-x-1 cursor-pointer">
                                <ToggleLike commentId={commentId} numberOfLikes={totalLikes} />
                            </div>
                            {userData?._id === ownerId && (
                                <button onClick={openDeleteModal}>
                                    <RiDeleteBin7Line className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-lg" title="Delete Comment" />
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-black-300 mt-2 text-sm leading-relaxed">{content || "Unable to fetch this comment right now..."}</p>
                </div>
            </div>
            {showModal && <DeleteComment memoryId={memoryId} closeModal={closeDeleteModal} commentId={commentId} />}
        </div>
    );
}

export default Comment;
