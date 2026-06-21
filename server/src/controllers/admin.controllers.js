
import { User } from "../models/user.model.js";
import { Memory } from "../models/memory.model.js";
import { Friendship } from "../models/friendship.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { TripJournal } from "../models/tripJournal.model.js";
import { TimeCapsule } from "../models/timeCapsule.model.js";
import { BucketList } from "../models/bucketList.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary.js";


const fetchAllUsers = asyncHandler(async(req, res, next) => {
    try{
        const allUsers = await User.find({});
        if(allUsers.length == 0){
            throw new ApiError(404, "No users found.");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allUsers,
                "Successfully fetched all Users !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching all users : ${err}`);
    }
})

const fetchUsersCount = asyncHandler(async(req, res, next) => {
    try{
        
        const allUsers = await User.countDocuments();
        if(allUsers == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    0,
                    "No user found"
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allUsers,
                "Successfully fetched all users count !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching users count : ${err}`);
    }
})   

const fetchUserById = asyncHandler(async(req, res, next) => {
    try{
        const userId = req.params.userId;
        if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid user id");
        }

        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Successfully fetched user by id !!"
            )
        )   


    }catch(err){
        console.error(`Error occurred while fetching user by id : ${err}`);
    }
})

const updateUserById = asyncHandler(async(req, res, next) => {  
    try{

        

    }catch(err){
        console.error(`Error occurred while updating user by id : ${err}`);
    }
})

const deleteUserById = asyncHandler(async(req, res, next) => {  
    try{
        const { userId } = req.params;
        const { deleteMemories, removeLikes, removeComments } = req.query;
        if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid User Id");
        }

        const userInfo = await User.deleteOne();
        if(!userInfo){
            throw new ApiError(400, "User does not exists");
        }

        const friendShipInfo = await Friendship.deleteMany(
            { $or: [{ requester: userId }, { recipient: userId }] }
        ); 

        

        if(deleteMemories){
            const memoryInfo = await Memory.deleteMany({ author : userId });
        }
        if(removeLikes){
            const likesInfo = await Like.deleteMany({ likedBy : userId });
        }
        if(removeComments){
            const commentInfo = await Comment.deleteMany({ owner : userId });
        }




        return res.status(200)
        .json(
            new ApiResponse(
                200,
                userInfo,
                "User Data successfully wiped off"
            )
        );

    }catch(err){
        console.error(`Error occurred while deleting user by id : ${err}`);
    }
})

const fetchMemoriesCount = asyncHandler(async(req, res, next) => {
    try{

        const allMemories = await Memory.countDocuments();
        if(allMemories == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    0,
                    "No memories found"
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allMemories,
                "Successfully fetched all memories count !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching memories count : ${err}`);
    }
})

const fetchMemories = asyncHandler(async(req, res, next) => {
    try{

        const allMemories = await Memory.find({}).populate("author", "username");
        if(allMemories.length == 0){
            throw new ApiError(404, "No memories found.");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allMemories,
                "Successfully fetched all Memories !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching memories : ${err}`);
    }
})

const fetchMemoryById = asyncHandler(async(req, res, next) => { 
    try{

        const memoryId = req.params.memoryId;
        if(!isValidObjectId(memoryId)){
            throw new ApiError(400, "Invalid memory id");
        }

        const memory = await Memory.findById(memoryId);
        if(!memory){
            throw new ApiError(404, "Memory not found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                memory,
                "Successfully fetched memory by id !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching memory by id : ${err}`);
    }
})

const updateMemoryById = asyncHandler(async(req, res, next) => {  
    try{

        

    }catch(err){
        console.error(`Error occurred while updating memory by id : ${err}`);
    }
})

const deleteMemoryById = asyncHandler(async(req, res, next) => {    
    try{

        const { memoryId } = req.params;
        if(!isValidObjectId(memoryId)){
            throw new ApiError(400, "Invalid Memory Id");
        }

        const memoryInfo = await Memory.findByIdAndDelete(memoryId);
        
        if(!memoryInfo){
            throw new ApiError(404, "Memory does not exists");
        }

        await deleteFromCloudinary(memoryInfo.thumbnail.public_id);

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                memoryInfo,
                "Memory successfully deleted"
            )
        );

    }catch(err){
        console.error(`Error occurred while deleting memory by id : ${err}`);
    }
})

const fetchCommentsCount = asyncHandler(async(req, res, next) => {
    try{

        const allComments = await Comment.countDocuments();
        if(allComments == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    0,
                    "No comments found"
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allComments,
                "Successfully fetched all comments count !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching comments count : ${err}`);
    }
})

const fetchComments = asyncHandler(async(req, res, next) => {
    try{

        const allComments = await Comment.find({});
        if(allComments.length == 0){
            throw new ApiError(404, "No comments found.");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allComments,
                "Successfully fetched all Comments !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching comments : ${err}`);
    }
})  

const fetchCommentById = asyncHandler(async(req, res, next) => {
    try{

        const commentId = req.params.commentId;
        if(!isValidObjectId(commentId)){
            throw new ApiError(400, "Invalid comment id");
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new ApiError(404, "Comment not found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Successfully fetched comment by id !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching comment by id : ${err}`);
    }
})  

const updateCommentById = asyncHandler(async(req, res, next) => {
    try{

    }catch(err){
        console.error(`Error occurred while updating comment by id : ${err}`);
    }
})  

const deleteCommentById = asyncHandler(async(req, res, next) => {  
    try{

        const { commentId } = req.params;
        if(!isValidObjectId(commentId)){
            throw new ApiError(400, "Invalid Comment Id");
        }

        const commentInfo = await Comment.findByIdAndDelete(commentId);
        if(!commentInfo){
            throw new ApiError(404, "Comment does not exists");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                commentInfo,
                "Comment successfully deleted"
            )
        );


    }catch(err){
        console.error(`Error occurred while deleting comment by id : ${err}`);
    }
})

const fetchLikesCount = asyncHandler(async(req, res, next) => {
    try{

        const allLikes = await Like.countDocuments();
        if(allLikes == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    0,
                    "No likes found"
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allLikes,
                "Successfully fetched all likes count !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching likes count : ${err}`);
    }
})  

const fetchLikes = asyncHandler(async(req, res, next) => {
    try{

        const allLikes = await Like.find({});
        if(allLikes.length == 0){
            throw new ApiError(404, "No likes found.");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allLikes,
                "Successfully fetched all Likes !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching likes : ${err}`);
    }
})

const fetchLikeById = asyncHandler(async(req, res, next) => {
    try{

        const likeId = req.params.likeId;
        if(!isValidObjectId(likeId)){
            throw new ApiError(400, "Invalid like id");
        }

        const like = await Like.findById(likeId);
        if(!like){
            throw new ApiError(404, "Like not found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                like,
                "Successfully fetched like by id !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching like by id : ${err}`);
    }
})

const updateLikeById = asyncHandler(async(req, res, next) => {
    try{

    }catch(err){
        console.error(`Error occurred while updating like by id : ${err}`);
    }
})  

const deleteLikeById = asyncHandler(async(req, res, next) => {
    try{    

        const { likeId } = req.params;
        if(!isValidObjectId(likeId)){
            throw new ApiError(400, "Invalid Like Id");
        }

        const likeInfo = await Like.findByIdAndDelete(likeId);
        if(!likeInfo){
            throw new ApiError(404, "Like does not exists");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                likeInfo,
                "Like successfully deleted"
            )
        );
        

    }catch(err){
        console.error(`Error occurred while deleting like by id : ${err}`);
    }
})

const fetchJournalCount = asyncHandler(async(req, res, next) => {
    try{

        const allJournals = await TripJournal.countDocuments();
        if(allJournals == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    0,
                    "No journals found"
                )
            )
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allJournals,
                "Successfully fetched all journals count !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching journals count : ${err}`);
    }
});

const fetchAllJournals = asyncHandler(async(req, res, next) => {
    try{

        const allJournals = await TripJournal.find({});
        if(allJournals.length == 0){
            throw new ApiError(404, "No journals found.");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                allJournals,
                "Successfully fetched all Journals !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching journals : ${err}`);
    }
});

const fetchJournalById = asyncHandler(async(req, res, next) => {
    try{

        const journalId = req.params.journalId;
        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid journal id");
        }

        const journal = await TripJournal.findById(journalId);
        if(!journal){
            throw new ApiError(404, "Journal not found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journal,
                "Successfully fetched journal by id !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching journal by id : ${err}`);
    }
});

const updateJournalById = asyncHandler(async(req, res, next) => {
    try{

    }catch(err){
        console.error(`Error occurred while updating journal by id : ${err}`);
    }
});

const fetchBucketListCount = asyncHandler(async(req, res, next) => {
    try{
        const bucketListCount = await BucketList.countDocuments({});
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                bucketListCount,
                "Successfully fetched bucket list count !!"
            )
        )
    }catch(err){
        console.error(`Error occurred while fetching bucket list count : ${err}`);
        throw new ApiError(400, "Error occurred while fething bucket list count !!");
    }
})

const fetchtimeCapsulesCount = asyncHandler(async(req, res, next) => {
    try{
        const timeCapsules = await TimeCapsule.countDocuments({});
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                timeCapsules,
                "Successfully fetched time capsules"
            )
        );
    }catch(err){
        console.error(`Error occurred while fetching time capsules count : ${err}`);
    }
})


const fetchCategoryStats = asyncHandler(async (req, res, next) => {
    try{
        const stats = await Memory.aggregate([
            { $group : {_id : "$category", count : {$sum : 1}} },
            { $project : {category : "$_id", count : 1, _id : 0}},
        ]);

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Successfully fetched category stats !!"
            )
        );
        

    }catch(err){
        console.error(`Error occurred while fetching category stats : ${err}`);
        throw new ApiError(400, "Error occurred while fetching category stats !!");
    }
}) 


const fetchMemoryOverTime = asyncHandler(async (req, res, next) => {
    try {
        const stats = await Memory.aggregate([
            { $group: { _id: "$tripDate", count: { $sum: 1 } } },
            { 
                $project: { 
                    date: "$_id", 
                    count: 1, 
                    _id: 0 
                } 
            },
            { $sort: { date: 1 } },
        ]);

        // Format the date before sending the response
        const formattedStats = stats.map(stat => ({
            date: new Date(stat.date).toISOString().split("T")[0], // Converts to 'YYYY-MM-DD'
            count: stat.count,
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                formattedStats,
                "Successfully fetched memory over time stats !!"
            )
        );

    } catch (err) {
        console.error(`Error occurred while fetching memory stats : ${err}`);
        throw new ApiError(400, "Error occurred while fetching memory stats !!");
    }
});


const fetchPopularLocations = asyncHandler(async (req, res, next) => {
    try{

        const stats = await Memory.aggregate([
            {$group : { _id : "$location", count : {$sum : 1}}},
            { $sort : { count : -1 } },
            { $limit : 5 },
            { $project : { location : "$_id", count : 1, _id : 0}},
        ]);
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Successfully fetched popular locations !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching popular locations : ${err}`);
        throw new ApiError(400, "Error occurred while fetching popular locations !!");
    }
})


const fetchMemoryEngagementStats = asyncHandler(async (req, res, next) => {
    try{

        const totalMemories = await Memory.countDocuments({});
        const totalLikes = await Memory.aggregate([
            { $group : { _id : null, totalLikes : {$sum : "$numberOfLikes"} }}
        ]);
        const totalComments = await Comment.countDocuments({});
        const averageLikes = totalLikes[0]?.totalLikes / totalMemories || 0;
        const averageComments = totalComments / totalMemories || 0;

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    averageLikesPerMemory : averageLikes.toFixed(2),
                    averageCommentsPerMemory : averageComments.toFixed(2)
                },
                "Successfully fetched memory engagement stats !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching memory engagement stats : ${err}`);
        throw new ApiError(400, "Error occurred fetching memory engagement stats !!");
    }
})

const fetchUserEngagements = asyncHandler(async (req, res, next) => {
    try {
        const memoryStats = await Memory.aggregate([
            { $group: { _id: "$tripDate", memoryCount: { $sum: 1 } } },
        ]);
        const commentStats = await Comment.aggregate([
            { $group: { _id: "$createdAt", commentCount: { $sum: 1 } } },
        ]);
        const likeStats = await Memory.aggregate([
            { $group: { _id: "$tripDate", likeCount: { $sum: "$numberOfLikes" } } },
        ]);

        const mergedStats = memoryStats.map((stat) => {
            const comments = commentStats.find(
                (c) => new Date(c._id).toISOString().split("T")[0] === new Date(stat._id).toISOString().split("T")[0]
            )?.commentCount || 0;

            const likes = likeStats.find(
                (l) => new Date(l._id).toISOString().split("T")[0] === new Date(stat._id).toISOString().split("T")[0]
            )?.likeCount || 0;

            return {
                date: new Date(stat._id).toISOString().split("T")[0], // Converts date to 'YYYY-MM-DD'
                memoryCount: stat.memoryCount,
                commentCount: comments,
                likeCount: likes,
            };
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                mergedStats,
                "Successfully fetched user engagement stats!"
            )
        );
    } catch (err) {
        console.error(`Error occurred while fetching user engagements: ${err}`);
        throw new ApiError(400, "Error occurred while fetching user engagements!");
    }
});


const fetchUserGrowthStats = asyncHandler(async (req, res, next) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: "$createdAt", // Group by the createdAt field
                    count: { $sum: 1 }, // Count the number of users created
                },
            },
            {
                $project: {
                    date: "$_id", // Rename _id to date for clarity
                    count: 1,
                    _id: 0, // Exclude the original _id field from the result
                },
            },
            { $sort: { date: 1 } }, // Sort by date
        ]);

        // Format the date before sending the response
        const formattedStats = stats.map(stat => ({
            date: new Date(stat.date).toISOString().split("T")[0], // Converts to 'YYYY-MM-DD'
            count: stat.count,
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                formattedStats,
                "Successfully fetched user growth stats!"
            )
        );
    } catch (err) {
        console.error(`Error occurred while fetching user growth stats: ${err}`);
        throw new ApiError(400, "Error occurred while fetching user growth stats!");
    }
});






export {
    fetchAllUsers,
    fetchUsersCount,
    fetchUserById,
    updateUserById,
    deleteUserById,
    fetchMemoriesCount,
    fetchMemories,
    fetchMemoryById,
    updateMemoryById,
    deleteMemoryById,
    fetchCommentsCount,
    fetchComments,
    fetchCommentById,
    updateCommentById,
    deleteCommentById,
    fetchLikesCount,
    fetchLikes,
    fetchLikeById,
    updateLikeById,
    deleteLikeById,
    fetchJournalCount,
    fetchAllJournals,
    fetchJournalById,
    updateJournalById,
    fetchCategoryStats,
    fetchMemoryOverTime,
    fetchPopularLocations,
    fetchMemoryEngagementStats,
    fetchUserEngagements,
    fetchUserGrowthStats,
    fetchBucketListCount,
    fetchtimeCapsulesCount
}



