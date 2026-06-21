import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Friendship } from "../models/friendship.model.js";
import { User } from "../models/user.model.js";

const sendFriendRequest = asyncHandler(async(req, res, next) => {
    try{
        const { recipientId } = req.params;
        const userId = req.user._id;
        // console.log("sending friend requests at backend..");
        if(!isValidObjectId(recipientId)){
            throw new ApiError(400, "Invalid Recipient Id ");
        }

        if(userId.equals(recipientId)){
            throw new ApiError(400, "You cannot send a friend request to yourself");
        }

        const existingRequest = await Friendship.findOne({
            requester : userId,
            recipient : recipientId,
            status : 'pending'
        })

        if(existingRequest){
            throw new ApiError(400, "Friend Request already sent !!");
        }

        const newFriendRequest = await Friendship.create({
            requester : userId,
            recipient : recipientId,
            status : 'pending'
        });

        return res.status(201)
        .json(
            new ApiResponse(
                201,
                newFriendRequest,
                "Friend Request Sent successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while sending a Friend Request : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while sending a friend request !!"); 
    }
})

const cancelFriendRequest = asyncHandler(async(req, res, next) => {
    try{
        const { requestId } = req.params;
        const userId = req.user._id;
        if(!isValidObjectId(requestId)){
            throw new ApiError(400, "Invalid Request Id");
        }

        const friendRequest = await Friendship.findById(requestId);

        if(!friendRequest){
            throw new ApiError(404, "Friend request not found !!");
        }

        if(friendRequest.requester.toString() !== userId.toString()){
            throw new ApiError(403, "You can only cancel friend requests you have sent !! ");
        }

        await friendRequest.deleteOne();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                friendRequest,
                "Friend request cancelled"
            )
        );


    }catch(err){
        console.error(`Error occurred while cancelling the friend request : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while cancelling the friend request !!");
    }
})

const acceptFriendRequest = asyncHandler(async(req, res, next) => {
    try{
        const { requestId } = req.params;
        const userId = req.user._id;
        if (!isValidObjectId(requestId)) {
            throw new ApiError(400, "Invalid or missing request ID");
        }

        const friendRequest = await Friendship.findById(requestId);

        if(!friendRequest || friendRequest.recipient.toString() !== userId.toString()){
            throw new ApiError(404, "Friend Request not found or you are not the recipient of the request !!");
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                friendRequest,
                "Friend Request Accepted Successfully"
            )
        );

    }catch(err){
        console.error(`Error occurred while accepting the friend Request : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while accepting the friend request !!");
    }
})

const searchFriendsByUsername = asyncHandler(async (req, res, next) => {
    try {
        let { page, limit, query } = req.query;
        const requesterId = req.user._id;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        if (!query) {
            throw new ApiError(400, "Search query not provided");
        }

        const searchingCondition = {
            username: { $regex: query, $options: "i" }
        };

        const totalUsers = await User.countDocuments(searchingCondition);

        if (totalUsers === 0) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        searchedUser: [],
                        totalUsers: 0,
                        totalPages: 0,
                        currentPage: page
                    },
                    "No users found"
                )
            );
        }

        const users = await User.find(searchingCondition)
            .skip(skip)
            .limit(limit)
            .select("_id username name avatar");

        const userIds = users.map(user => user._id);

        const friendships = await Friendship.find({
            $or: [
                { requester: requesterId, recipient: { $in: userIds } },
                { recipient: requesterId, requester: { $in: userIds } }
            ]
        });

        const friendshipMap = friendships.reduce((map, friendship) => {
            const friendId = friendship.requester.equals(requesterId) ? friendship.recipient : friendship.requester;
            let status;
            if (friendship.status === "accepted") {
                status = "friend";
            } else if (friendship.requester.equals(requesterId)) {
                status = "requestSent";
            } else {
                status = "requestReceived";
            }
            map[friendId.toString()] = {
                status,
                requestId: friendship._id 
            };
            return map;
        }, {});

        const searchedUser = users.map(user => ({
            user,
            friendshipStatus: friendshipMap[user._id.toString()]?.status || "none",
            requestId: friendshipMap[user._id.toString()]?.requestId || null
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    searchedUser,
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    currentPage: page
                },
                "Users found for the specified query!"
            )
        );

    } catch (err) {
        console.error("Error occurred while searching for friends by username:", err);
        next(new ApiError(400, err.message || "Error occurred while searching for friends!"));
    }
});

const declineFriendRequest = asyncHandler(async(req, res, next) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;
        
        if (!isValidObjectId(requestId)) {
            throw new ApiError(400, "Invalid Request Id");
        }

        const friendRequest = await Friendship.findById(requestId);

        if (!friendRequest || friendRequest.recipient.toString() !== userId.toString()) {
            throw new ApiError(404, "Friend request not found or you are not the recipient");
        }

        await friendRequest.deleteOne();

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Friend Request Declined and Deleted Successfully"
            )
        );

    } catch (err) {
        console.error(`Error occurred while declining the friend request: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while declining the friend request!");
    }
});


const listAllFriends = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const acceptedFriends = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: 'accepted'
        })
        .populate('requester recipient', 'name email avatar username')
        .skip(skip)
        .limit(limit);

        const totalFriends = await Friendship.countDocuments({
            $or: [{ requester: userId }, { recipient: userId }],
            status: 'accepted'
        });

        const friendsWithStatus = acceptedFriends.map(friendship => {
            const friend = friendship.requester.equals(userId)
                ? friendship.recipient
                : friendship.requester;

            return {
                friend,
                friendshipStatus: 'friend',
            };
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    friends: friendsWithStatus,
                    totalFriends,
                    totalPages: Math.ceil(totalFriends / limit),
                    currentPage: page,
                },
                "Successfully fetched friends list"
            )
        );

    } catch (err) {
        console.error(`Error occurred while fetching the friend list: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching the friend list");
    }
});

const getPendingRequests = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;
        // console.log("fetching pending requests from backend...");
        const pendingRequests = await Friendship.find({
            recipient: userId,
            status: "pending"
        }).populate('requester', 'name email avatar username');


        const requestsWithStatus = pendingRequests.map((request) => ({
            requestId : request._id,
            requester: request.requester,
            friendshipStatus: 'requestReceived',
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                {pendingRequests : requestsWithStatus},
                "Pending Friend Requests fetched Successfully"
            )
        );

    } catch (err) {
        console.error(`Error occurred while fetching pending friend requests: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching pending friend requests!");
    }
});

const removeFriend = asyncHandler(async (req, res, next) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id;
        if (!isValidObjectId(friendId)) {
            throw new ApiError(400, "Invalid Friend Id");
        }

        const friendship = await Friendship.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId, status: 'accepted' },
                { requester: friendId, recipient: userId, status: 'accepted' }
            ]
        });

        if (!friendship) {
            throw new ApiError(400, "Friendship not found!");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                { friendshipStatus: 'none' },
                "Friend Removed Successfully"
            )
        );
    } catch (err) {
        console.error(`Error occurred while removing a friend from the friend list: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while removing a friend from the friend list!");
    }
});


export {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    listAllFriends,
    getPendingRequests,
    removeFriend,
    searchFriendsByUsername
}

