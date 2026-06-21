import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Memory } from "../models/memory.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleMemoryLike = asyncHandler(async (req, res, next) => {
    try {
        const { memoryId } = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(memoryId)) {
            throw new ApiError(400, "Invalid Memory Id");
        }

        const memory = await Memory.findById(memoryId);
        if (!memory) {
            throw new ApiError(400, "Memory does not exist");
        }

        const likedMemory = await Like.findOne({ likedBy: userId, memory: memoryId });

        if (!likedMemory) {
            const newLike = await Like.create({
                likedBy: userId,
                memory: memoryId,
            });

            if (!newLike) {
                throw new ApiError(400, "Some Error occurred");
            }

            const updatedMemory = await Memory.findByIdAndUpdate(
                memoryId,
                { $inc: { numberOfLikes: 1 } },
                { new: true } 
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { numberOfLikes: updatedMemory.numberOfLikes },
                    "Memory Liked Successfully"
                )
            );
        } else {
            await likedMemory.deleteOne();

            const updatedMemory = await Memory.findByIdAndUpdate(
                memoryId,
                { $inc: { numberOfLikes: -1 } },
                { new: true }
            );

            if (updatedMemory.numberOfLikes < 0) {
                updatedMemory.numberOfLikes = 0; 
                await updatedMemory.save();
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { numberOfLikes: updatedMemory.numberOfLikes },
                    "Like Removed Successfully"
                )
            );
        }
    } catch (err) {
        console.error(`Error occurred while toggling Memory Like: ${err}`);
        throw new ApiError(400, "Error occurred while toggling the Memory Like");
    }
});



const toggleCommentLike = asyncHandler(async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid Comment Id");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new ApiError(400, "Comment does not exist");
        }

        const likedComment = await Like.findOne({ likedBy: userId, comment: commentId });

        if (!likedComment) {
            const newLike = await Like.create({
                likedBy: userId,
                comment: commentId
            });

            if (!newLike) {
                throw new ApiError(400, "Some error occurred");
            }

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { numberOfLikes: 1 } },
                { new: true }
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { numberOfLikes: updatedComment.numberOfLikes },
                    "Comment Liked Successfully"
                )
            );
        } else {
            await likedComment.deleteOne();

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { numberOfLikes: -1 } },
                { new: true }
            );

            if (updatedComment.numberOfLikes < 0) {
                updatedComment.numberOfLikes = 0; 
                await updatedComment.save();
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { numberOfLikes: updatedComment.numberOfLikes },
                    "Like Removed Successfully"
                )
            );
        }
    } catch (err) {
        console.error(`Error occurred while toggling Comment like: ${err}`);
        throw new ApiError(400, "Error occurred while toggling Comment Like");
    }
});



export{
    toggleMemoryLike,
    toggleCommentLike
}