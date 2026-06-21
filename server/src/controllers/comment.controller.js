import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Memory } from "../models/memory.model.js";



const addComment = asyncHandler(async(req, res, next) => {
    try{
        const { memoryId } = req.params;
        const userId = req.user._id;
        const { content } = req.body;

        if(!isValidObjectId(memoryId)){
            throw new ApiError(400, "Invalid Memory Id");
        }

        const newComment = await Comment.create({
            content,
            memory : memoryId,
            owner : userId
        })

        if(!newComment){
            throw new ApiError(400, "Error occurred, please try again later..");
        }

        return res.status(201)
        .json(
            new ApiResponse(
                201,
                newComment,
                "New Comment added Successfully"
            )
        )


    }catch(err){
        console.error(`Error occurred while adding a new comment : ${err}`);
        throw new ApiError(400,err?.message ||  "Error occurred while adding a new comment")
    }
})

const deleteComment = asyncHandler(async(req, res, next) => {
    try {
        const { commentId } = req.params; 

        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid Comment Id");
        }

        const reqComment = await Comment.findById(commentId);
        if (!reqComment) {
            throw new ApiError(404, "Comment does not exist");
        }

        if (reqComment.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(400, "You are not authorized to delete this comment");
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            throw new ApiError(400, "Comment not deleted, please try again later...");
        }

        return res.status(200).json(
            new ApiResponse(200, deletedComment, "Comment Deleted Successfully")
        );
    } catch (err) {
        console.error(`Error occurred while deleting a comment: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while deleting a comment");
    }
});

const fetchAllComments = asyncHandler(async(req, res, next) => {
    try {
        const { memoryId } = req.params;

        if (!isValidObjectId(memoryId)) {
            throw new ApiError(400, "Invalid Memory Id");
        }

        const memory = await Memory.findById(memoryId);
        if (!memory) {
            throw new ApiError(404, "Memory does not exist");
        }

        const allComments = await Comment.find({ memory: memoryId }).sort({ createdAt: -1 }).populate("owner","avatar username");

        return res.status(200).json(
            new ApiResponse(200, allComments, allComments.length > 0 ? "Comments Fetched Successfully" : "No Comments Yet")
        );
    } catch (err) {
        console.error(`Error occurred while fetching comments: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching comments");
    }
});




export { 
    addComment,
    deleteComment,
    fetchAllComments
}



