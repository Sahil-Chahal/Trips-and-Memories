import { isValidObjectId } from "mongoose";
import { TimeCapsule } from "../models/timeCapsule.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";




const createTimeCapsule = asyncHandler(async(req, res, next) => {
    try{
        const {  title, description, openDate, memoryText,  memoryDescription } = req.body;
        // console.log("title : ", title);
        // console.log("description : ", description);
        // console.log("openDate : ", openDate);
        // console.log("memoryText : ", memoryText);
        // console.log("memoryDescription : ", memoryDescription);

        // console.log("Req.body : ", req.body);

        const userId = req.user._id;

        if(!title || !description || !openDate || !memoryDescription || !memoryText){
            throw new ApiError(400, "All fields are mandatory");
        }

        if(req.file){
            const memoryImgLocalPath = req.file?.path;
            const memoryImg = await uploadOnCloudinary(memoryImgLocalPath);
            if(!memoryImg){
                throw new ApiError(400, "Memory Image corrupted, plase try again later..");
            }

            const newCapsule = await TimeCapsule.create({
                owner : userId,
                title,
                description,
                openDate,
                memoryText,
                memoryDescription,
                memoryImg : {
                    public_id : memoryImg.public_id,
                    secure_url : memoryImg.secure_url
                }
            })

            return res.status(201)
            .json(
                new ApiResponse(
                    201,
                    newCapsule,
                    `Time Capsule successfully created and will unlock on ${openDate}`
                )
            );

        }else{
            throw new ApiError(400, "Memory Image file is required !!");
        }


    }catch(err){
        console.error(`Error occurred while creating a time capsule : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while creating a time capsule !!");
    }
})

const fetchAllTimeCapsulesofUser = asyncHandler(async(req, res, next) => {
    try{
        const userId = req.user._id;
        const { status } = req.query;
        let query = { owner : userId };
        if(status){
            query.isUnlocked = (status == "locked" ) ? false : true;
        }


        const capsules = await TimeCapsule.find(query).select("-description -memoryDescription -owner");

        if(capsules.length == 0){
            return res.status(200).json(new ApiResponse(200, capsules, "No Time Capsules found"));
        }

        return res.status(200).json(
            new ApiResponse(200, capsules, "Successfully fetched Time Capsules")
        );

    }catch(err){        
        console.error(`Error occurred while fetching all Time Capsules of the user : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching all time capsules of the user !!");
    }
})


const fetchTimeCapsuleDetails = asyncHandler(async(req, res, next) => {
    try{
        const { capsuleId } = req.params;
        console.log("CapsuleID : ", capsuleId);
        const userId = req.user._id;

        if(!isValidObjectId(capsuleId)){
            throw new ApiError(400, "Invalid Capsule Id");
        }

        const capsule = await TimeCapsule.findOne({_id : capsuleId, owner : userId});

        if(!capsule){
            throw new ApiError(404, "Requested Time Capsule does not exists !!");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                capsule,
                "Successfully fetched Time Capsule Details"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching a time capsule details : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching a time capsule details");
    }
})

const deleteTimeCapsule = asyncHandler(async (req, res, next) => {
    try {
        const { capsuleId } = req.params;
        const userId = req.user._id;


        if (!isValidObjectId(capsuleId)) {
            throw new ApiError(400, "Invalid Capsule ID");
        }


        const deletedCapsule = await TimeCapsule.findOneAndDelete({
            _id: capsuleId,
            owner: userId
        });

        await deleteFromCloudinary(deletedCapsule?.memoryImg?.public_id);

        if (!deletedCapsule) {
            return res.status(404).json(new ApiError(404, "Time Capsule not found or you are not authorized to delete it"));
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                deletedCapsule,
                "Time Capsule successfully deleted"
            )
        );

    } catch (err) {
        console.error(`Error occurred while deleting a time capsule: ${err}`);
        throw new ApiError(500, err?.message || "Error occurred while deleting a time capsule");
    }
});



export { 
    createTimeCapsule,
    fetchAllTimeCapsulesofUser,
    fetchTimeCapsuleDetails,
    deleteTimeCapsule,

}


