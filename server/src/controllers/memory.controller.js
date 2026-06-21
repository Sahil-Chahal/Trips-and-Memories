import { isValidObjectId } from "mongoose";
import { Memory } from "../models/memory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";


const fetchAllMemories = asyncHandler(async(req, res, next) => {
    try{
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;

        const skip = ( page - 1 ) * limit;

        const totalMemories = await Memory.countDocuments();
        
        if(totalMemories === 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        allMemories : [],
                        totalMemories,
                        totalPages : 0,
                        currentPage : page
                    }
                )
            )
        }

        const allMemories = await Memory.find({})
            .skip(skip)
            .limit(limit)
            .populate("author", "username avatar")
            .sort({ createdAt : -1 });

        const totalPages = Math.ceil(totalMemories / limit);
            if (page > totalPages) {
                return res.status(200).json(
                    new ApiResponse(
                        200,
                        {
                            allMemories: [],
                            totalMemories,
                            totalPages,
                            currentPage: page,
                        },
                        "Page exceeds total number of pages"
                    )
                );
            }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    allMemories,
                    totalMemories,
                    totalPages,
                    currentPage : page
                },
                "All Memories fetched Successfully"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching all memories : ${err}`);
        throw new ApiError(500, `Error occurred while fetching all memories : ${err}`);
    }
});

const fetchPersonalMemories = asyncHandler(async(req, res, next) => {
    try{    
        const userId = req.user._id;
        console.log("UserID ----> ",userId);

        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;

        const skip = ( page - 1 ) * limit;

        const totalMemories = await Memory.countDocuments({ author : userId });

        if(totalMemories === 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        allMemories : [],
                        totalMemories,
                        totalPages : 0,
                        currentPage : page
                    },
                    "No Memories Created Yet !!"
                )
            )
        }
        const totalPages = Math.ceil(totalMemories / limit);
        if (page > totalPages) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        personalMemories: [],
                        totalMemories,
                        totalPages,
                        currentPage: page,
                    },
                    "Page exceeds total number of pages"
                )
            );
        }

        const personalMemories = await Memory.find({ author : userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt : -1 });

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    personalMemories,
                    totalMemories,
                    totalPages,
                    currentPage : page
                },
                "Personal Memories Fetched Successfully"
            )
        )


    }catch(err){
        console.error(`Error occurred while fetching personal Memories ..: ${err}`);
        throw new ApiError(400, `Some error occurred while fetching Personal Memories`);
    }
})

const fetchMemoryBySearch = asyncHandler(async(req, res, next) => {
    try{
        let { page, limit, query } = req.query;

        if(!query){
            throw new ApiError(400, "No search query is provided for searching...");
        }

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 6;

        const skip = ( page - 1 ) * limit;

        const searchCondition = {
            $or : [
                { title : {$regex : query, $options : "i"} },
                { category : {$regex : query, $options : "i"} },
                { tags: { $in: [new RegExp(query, "i")] }  }
            ]
        }

        const totalMemories = await Memory.countDocuments(searchCondition);
        if(totalMemories === 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        allMemories : [],
                        totalMemories,
                        totalPages : 0,
                        currentPage : page
                    },
                    "No Memory found matching the query"
                )
            )
        }

        const totalPages = Math.ceil(totalMemories / limit);
        const allMemories = await Memory.find(searchCondition)
        .skip(skip)
        .limit(limit)
        .populate("author", "username avatar");

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    allMemories,
                    totalMemories,
                    totalPages,
                    currentPage : page
                },
                "Memories matching query fetched successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching Memory by search query !!`);
        throw new ApiError(400, err?.message || "Error occurred while fetching Memory by search query !!!");
    }
})

const fetchMemoryByAuthor = asyncHandler(async(req, res, next) => {
    try{
        let { page, limit } = req.query;
        const { authorId } = req.params;

        if(!isValidObjectId(authorId)){
            throw new ApiError(400, "Invalid Author Id");
        }

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 6;

        const skip = ( page - 1 ) * limit;

        const totalMemories = await Memory.countDocuments({ author : authorId });
        

        if(totalMemories.length == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        authorMemories : [],
                        totalMemories,
                        totalPages : 0,
                        currentPage : page
                    },
                    "No Memory found for this author"
                )
            )
        }

        const authorMemories = await Memory.find({ author : authorId })
        .skip(skip)
        .limit(limit)
        .populate("author", "username author");

        const totalPages = Math.ceil(totalMemories / limit);

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    authorMemories,
                    totalMemories,
                    totalPages,
                    currentPage : page
                },
                "Memories for the particular author fetched successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching memories of a particular author`);
        throw new ApiError(400, err?.message || "Error occurred while fetching memories for a particular author");
    }
})

const viewMemory = asyncHandler(async(req, res, next) => {
    try{    
        const { memoryId } = req.params;

        if(!isValidObjectId(memoryId)){
            throw new ApiError(400, "Invalid Memory Id !!");
        }

        const memory = await Memory.findById(memoryId);
        if(!memory){
            throw new ApiError(404, "Memory doesn't exists");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                memory,
                "Memory Content fetched Successfully !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching a memory : ${err}`);
        throw new ApiError(400, err?.message || "Some Error occurred while fetching Memory Content");
    }
})


const createMemory = asyncHandler(async(req, res, next) => {
    try {
        const { title, content, tripDate, location, tags, category } = req.body;
        const userId = req.user._id;


        if (!title || !content || !location || !tags || !category) {
            throw new ApiError(400, "All Fields are mandatory");
        }


        if (!Array.isArray(tags)) {
            throw new ApiError(400, "Please provide tags in an array");
        }


        if (!req.file) {
            throw new ApiError(400, "Thumbnail is required to create a memory");
        }


        const thumbnailPath = req.file?.path;
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!thumbnail) {
            throw new ApiError(400, "Error occurred while processing thumbnail file");
        }


        const memory = await Memory.create({
            title,
            content,
            author: userId,
            tripDate: tripDate || Date.now(),
            location,
            tags,
            category,
            thumbnail: {
                public_id: thumbnail.public_id,
                secure_url: thumbnail.secure_url
            }
        });

        if (!memory) {
            throw new ApiError(400, "Error occurred while creating a new memory");
        }


        await User.findByIdAndUpdate(
            userId,
            { $inc: { numberOfMemories: 1 } }
        );


        return res.status(201).json(
            new ApiResponse(
                201,
                memory,
                "New Memory Created Successfully"
            )
        );

    } catch (err) {

        console.error(`Error occurred while creating a new memory: ${err}`);
        throw new ApiError(400, err.message || "Error occurred while creating a new memory");
    }
});


const updateMemory = asyncHandler(async(req, res, next) => {
    try {
        const { title, content, location, tags, category } = req.body;
        const { memoryId } = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(memoryId)) {
            throw new ApiError(400, " Invalid Memory Id ");
        }

        if (!title && !content && !location && !tags && !category) {
            throw new ApiError(400, "At least one field is required for updation");
        }

        const memory = await Memory.findById(memoryId);
        if (!memory) {
            throw new ApiError(404, "Memory does not exist !!");
        }

        if (memory.author.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to update the Memory");
        }

        let updationFields = {};
        if (title) updationFields.title = title;
        if (content) updationFields.content = content;
        if (location) updationFields.location = location;
        if (tags) updationFields.tags = tags; 
        if (category) updationFields.category = category;

        const updatedMemory = await Memory.findByIdAndUpdate(
            memoryId,
            { $set: updationFields },
            { new: true }
        );

        if (!updatedMemory) {
            throw new ApiError(400, "Error updating Memory details");
        }

        return res.status(200).json(
            new ApiResponse(200, updatedMemory, "Memory Details Updated Successfully")
        );
    } catch (err) {
        console.error(`Error occurred while updating the memory details: ${err}`);
        throw new ApiError(400, err?.message || "Some Error occurred while updating memory details");
    }
});


const updateMemoryThumbnail = asyncHandler(async(req, res, next) => {
    try{
        const { memoryId } = req.params;
        const userId = req.user._id;


        if(!isValidObjectId(memoryId)){
            throw new ApiError(400, "Invalid Memory Id");
        }

        const memory = await Memory.findById(memoryId);
        if(!memory){
            throw new ApiError(404, "Memory does not exists !!");
        }

        if(memory.author.toString() !== userId.toString()){
            throw new ApiError(403, "You are not authorized to update the Memory Thumbnail");
        }

        if(req.file){
            const thumb = req.file?.path;
            const thumbnail = await uploadOnCloudinary(thumb);
            if(!thumbnail){
                throw new ApiError(400, "Error occurred while updating thumbnail !! ");
            }

            const prevThumbnailId = memory.thumbnail.public_id;

            const updatedMemory = await Memory.findByIdAndUpdate(
                memoryId,
                {
                    $set : {
                        thumbnail : {
                            public_id : thumbnail.public_id,
                            secure_url : thumbnail.secure_url
                        }
                    }
                },
                { new : true }
            )

            if(!updatedMemory){
                throw new ApiError(400, "Error occurred while updating the thumbnail, please try again later..");
            }

            await deleteFromCloudinary(prevThumbnailId);

            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedMemory,
                    "Memory Thumbnail Updated Successfully"
                )
            );


        }else{
            throw new ApiError(403, "Thumbnail File is required");
        }

    }catch(err){
        console.error(`Error occurred while updating thumbnail : ${err}`);
        throw new ApiError(400, err?.message ||  "Error occurred while updating the memory thumbnail !!");

    }
})

const deleteMemory = asyncHandler(async (req, res, next) => {
    try {
        const { memoryId } = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(memoryId)) {
            throw new ApiError(400, "Invalid Memory Id");
        }

        const memory = await Memory.findById(memoryId);
        if (!memory) {
            throw new ApiError(404, "Memory does not exist");
        }

        if (memory.author.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to delete this memory");
        }

        const deletedMemory = await Memory.findByIdAndDelete(memoryId);

        await deleteFromCloudinary(deletedMemory?.thumbnail?.public_id);

        if (!deletedMemory) {
            throw new ApiError(400, "Memory not deleted, please try again later");
        }

        await User.findByIdAndUpdate(
            userId,
            {$inc : {numberOfMemories : -1}}
        );

        return res.status(200).json(
            new ApiResponse(200, deletedMemory, "Memory deleted successfully")
        );

    } catch (err) {
        console.error(`Error occurred while deleting the memory: ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while deleting the memory");
    }
});


export {
    fetchAllMemories,
    fetchMemoryBySearch,
    fetchPersonalMemories,
    fetchMemoryByAuthor,
    viewMemory,
    createMemory,
    updateMemory,
    updateMemoryThumbnail,
    deleteMemory
}


