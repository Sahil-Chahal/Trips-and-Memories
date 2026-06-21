
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Memory } from "../models/memory.model.js";
import { BucketList } from "../models/bucketList.model.js";

const toggleBucketListItem = asyncHandler(async( req, res, next) => {
    try{
        const { memoryId } = req.params;
        const userId = req.user._id;
        if(!isValidObjectId(memoryId)){
            throw new ApiError(400, "Invalid Memory Id");
        }

        const memory = await Memory.findById(memoryId);
        if(!memory){
            throw new ApiError(404, "Memory not found");
        }

        const bucketItemExists = await BucketList.findOne({ owner : userId, memory : memoryId });
        if(bucketItemExists){
            await bucketItemExists.deleteOne();
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    bucketItemExists,
                    "Memory successfully removed from Bucket List"
                )
            )
        }else{
            const bucketItem = await BucketList.create({
                owner : userId,
                memory : memoryId
            });

            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    bucketItem,
                    "Memory Successfully added to Bucket List"
                )
            )

        }

        
        
    }catch(err){
        console.error(`Error occurred while toggling the bucketList item : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while toggling the Bucket List Item");
    }
})

const clearBucketList = asyncHandler(async(req, res, next) => {
    try{
        const userId = req.user._id;
        const deletedBucketList = await BucketList.deleteMany({ owner : userId });


        return res.status(200)
        .json(
            new ApiResponse(
                200,
                deletedBucketList,
                "Bucket List wiped off successfully"
            )
        );

    }catch(err){
        console.error(`Error occurred while clearing bucket list : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while clearing the Bucket List");
    }
})

const getAllBucketListItems = asyncHandler(async(req, res, next) => {
    try{
        const userId = req.user._id;
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 4;

        const skip = ( page - 1 ) * limit;

        const totalItems = await BucketList.countDocuments({ owner : userId});
        if(totalItems === 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        fullBucketList : [],
                        totalItems,
                        totalPages : 0,
                        currentPage : page,
                    },
                    "You haven't added any Items in Bucket List yet"
                )
            );
        }

        const fullBucketList = await BucketList.find({owner : userId})
        .skip(skip)
        .limit(limit)
        .populate("memory");
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    fullBucketList,
                    totalItems,
                    totalPages,
                    currentPage : page
                },
                "Bucket List Items fetched Successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching all bucket list items : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching all Bucket List items");
    }
})

export{
    toggleBucketListItem,
    clearBucketList,
    getAllBucketListItems
}

