import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TripJournal } from "../models/tripJournal.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createTripJournal = asyncHandler(async(req, res, next) => {
    try{
        const { title, description } = req.body;
        const userId = req.user._id;

        if(!title || !description){
            throw new ApiError(400, "Title and description are required");
        }

        const newJournal = await TripJournal.create({
            title,
            description,
            contributors : [userId],
            createdBy : userId
        })

        return res.status(201)
        .json(
            new ApiResponse(
                201,
                newJournal,
                "Trip Journal created Successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while creating a new journal : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while creating a new journal !!");
    }
})

const fetchUserTripJournals = asyncHandler(async(req, res, next) => {
    try{
        const userId = req?.user?._id;

        const searchCondition = {
            $or: [
                { createdBy: userId },
                { contributors: { $in: [userId] } }
            ]
        }

        const journalsCount = await TripJournal.countDocuments(searchCondition);

        if(journalsCount == 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    [],
                    "No Journals found"
                )
            )
        }

        const journals = await TripJournal.find(searchCondition);
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journals,
                "Successfully fetched user trip journals !!"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching user trip journals : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching users trip journals ");
    }
})

const addEntryToJournal = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;
        const userId = req.user._id;
        const { content } = req.body;
        // console.log("Req-body : ", req.body);
        // console.log("JorunalId & content :", journalId, content);
        // console.log("Req-files :", req.files);

        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const journal = await TripJournal.findById(journalId);
        // if(!journal || !journal.isDeleted){
        //     throw new ApiError(404, "Trip Journal not found !!");
        // }

        if(journal.status == "closed"){
            throw new ApiError(400, "Journal closed by author");
        }

        if(!journal.contributors.includes(userId)){
            throw new ApiError(403, "You are not a contributor to this journal !!");
        }

        const images = [];

        if(req?.file || req?.files?.length > 0){
            for(const file of req.files){
                const imgLocalPath = file.path;
                const img = await uploadOnCloudinary(imgLocalPath);
                if(!img){
                    throw new ApiError(400, "File corrupted, please try again later...");
                }
                images.push({
                    public_id : img.public_id,
                    secure_url : img.secure_url
                })
            }
        }else{
            throw new ApiError(400, "Atleast one file is required for creating an entry in the journal");
        }

        journal.entries.push({
            contributor : userId,
            content,
            images
        })

        await journal.save();
        return res.status(201)
        .json(
            new ApiResponse(
                201,
                journal,
                "Entry added to trip journal successfully"
            )
        );

    }catch(err){
        console.error(`Error occurred while adding entry to the journal : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while adding an entry to the journal !!");
    }
})

const fetchTripJournalDetails = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;

        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const journal = await TripJournal.findById(journalId)
        .populate("contributors", "name email")
        .populate("entries.contributor", "name email")
        .populate("createdBy", "name email");


        if(!journal || journal.isDeleted){
            throw new ApiError(404, "Trip Journal not found");
        }

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journal,
                "Trip Journal fetched successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while fetching a trip journal : ${err}`);
        throw new ApiError(400, err?.message ||  "Error occurred while fetching a trip journal !!");
    }
})

const fetchTripJournalEntries = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;
        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const journalEntries = await TripJournal.findById(journalId)
        .select("-title -description -createdAt -updatedAt -isDeleted  -contributors")
        .populate("entries.contributor", "username name avatar");

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journalEntries,
                "Successfully fetched journal Entries !!"
            )
        );

    }catch(err){
        console.error(`Error occurred while fetching trip journal entries : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching trip journals entries !!");
    }
})

const fetchJournalContributors = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;

        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const contributors = await TripJournal.findById(journalId)
        .select("-title -description -isDeleted -status -entries -aiGeneratedStory")
        .populate({
            path : "contributors",
            select : "username name email avatar"
        })

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                contributors,
                "Contributors fetched successfully !!"
            )
        )



    }catch(err){
        console.error(`Error occurred while fetching journal contributors : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while fetching journal contributors !!");
    }
})

const closeJournal = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;
        const userId = req.user._id;

        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const journal = await TripJournal.findById(journalId);
        if(!journal || journal.isDeleted){
            throw new ApiError(404, "Trip Journal not found !!");
        }

        if(journal.createdBy.toString() !== userId.toString()){
            throw new ApiError(403, "Only the creator can close this journal !!");
        }

        journal.status = "closed";
        await journal.save();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journal,
                "Journal Closed Successfully"
            )
        )

    }catch(err){
        console.error(`Error occurred while closing the Journal : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while closing the journal");
    }
})

const deleteJournal = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;
        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const journalExists = await TripJournal.findById(journalId);
        if(!journalExists){
            throw new ApiError(400, "Requested Journal Does not exists !!");
        }

        for(const entry of journalExists.entries){
            if(entry?.images?.length){
                for(const img of entry.images){
                    if(img?.public_id){
                        await deleteFromCloudinary(img.public_id);
                    }
                }
            }
        }

        await journalExists.deleteOne();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journalExists,
                "Journal Successfully Deleted"
            )
        )

    }catch(err){
        console.error(`Error occurred while deleting the journal !!`);
        throw new ApiError(400, err?.message || "Journal Deletion failed !!");
    }
})

const addContributor = asyncHandler(async (req, res, next) => {
    try {
        const { friendId, journalId } = req.params;
        const userId = req.user._id;


        if (!isValidObjectId(friendId) || !isValidObjectId(journalId)) {
            throw new ApiError(400, "Invalid Friend ID or Journal ID");
        }

        let journal = await TripJournal.findById(journalId);
        if (!journal) {
            throw new ApiError(404, "Trip Journal not found!");
        }


        if (journal.createdBy.toString() !== userId.toString()) {
            throw new ApiError(403, "Only the journal creator can manage contributors");
        }


        const isAlreadyContributor = journal.contributors.includes(friendId);
        if (isAlreadyContributor) {
            throw new ApiError(400, "This user is already a contributor to the journal");
        }


        journal.contributors.push(friendId);
        await journal.save();

        journal = await TripJournal.findById(journalId)
        .select("-title -description -isDeleted -status -entries -aiGeneratedStory")
        .populate({
            path : "contributors",
            select : "username name email avatar"
        });


        return res.status(200).json(
            new ApiResponse(
                200,
                journal.contributors,
                "Contributor added successfully!"
            )
        );
    } catch (err) {
        console.error(`Error occurred while adding a new contributor: ${err}`);
        throw new ApiError(
            400,
            err?.message || "Error occurred while adding a new contributor!"
        );
    }
});

const removeContributor = asyncHandler(async (req, res, next) => {
    try {
        const { friendId, journalId } = req.params;
        const userId = req.user._id;


        if (!isValidObjectId(friendId) || !isValidObjectId(journalId)) {
            throw new ApiError(400, "Invalid Friend ID or Journal ID");
        }


        let journal = await TripJournal.findById(journalId);
        if (!journal) {
            throw new ApiError(404, "Trip Journal not found!");
        }


        if (journal.createdBy.toString() !== userId.toString()) {
            throw new ApiError(403, "Only the journal creator can manage contributors");
        }


        const isContributor = journal.contributors.includes(friendId);
        if (!isContributor) {
            throw new ApiError(400, "This user is not a contributor to the journal");
        }


        journal.contributors = journal.contributors.filter(
            (contributorId) => contributorId.toString() !== friendId
        );


        await journal.save();
        journal = await TripJournal.findById(journalId)
        .select("-title -description -isDeleted -status -entries -aiGeneratedStory")
        .populate({
            path : "contributors",
            select : "username name email avatar"
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                journal.contributors,
                "Contributor removed successfully!"
            )
        );
    } catch (err) {
        console.error(`Error occurred while removing a contributor: ${err}`);
        throw new ApiError(
            400,
            err?.message || "Error occurred while removing a contributor!"
        );
    }
});


const manageContributors = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;
        const { contributors } = req.body;
        const userId = req.user._id;

        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }

        const journal = await TripJournal.findById(journalId);
        if(!journal || journal.isDeleted){
            throw new ApiError(404, "Trip Journal not found !!");
        }

        if(journal.createdBy.toString() !== userId.toString()){
            throw new ApiError(403, "Only the Journal creator can manage contributors");
        }

        journal.contributors = contributors;
        await journal.save();

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                journal,
                "Contributors updated successfully"
            )
        );

    }catch(err){
        console.error(`Error occurred while managing the contributors : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while managing the contributors !!");
    }
})

export { 
    createTripJournal,
    addEntryToJournal,
    fetchUserTripJournals,
    fetchTripJournalDetails,
    fetchTripJournalEntries,
    closeJournal,
    deleteJournal,
    fetchJournalContributors,
    manageContributors,
    addContributor,
    removeContributor
}