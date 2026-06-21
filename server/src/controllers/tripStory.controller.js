import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TripJournal } from "../models/tripJournal.model.js";
import { isValidObjectId } from "mongoose";
import { generateTripStory } from "../utils/generateTripStory.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTripStory = asyncHandler(async(req, res, next) => {
    try{
        const { journalId } = req.params;

        if(!isValidObjectId(journalId)){
            throw new ApiError(400, "Invalid Journal Id");
        }


        const journal = await TripJournal.findById(journalId);
        if(!journal || journal.isDeleted){
            throw new ApiError(404, "Trip Journal not found !!");
        }

        const inputText = `Generate a funky story based on the following trip journal. Title : "${journal.title}" and Description : "${journal.description}"`;

        const generatedStory = await generateTripStory(inputText);
        // console.log("Generated story : ", )

        journal.aiGeneratedStory = generatedStory;
        await journal.save();
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                generatedStory,
                "Trip Story generated successfully"
            )
        );

    }catch(err){
        console.error(`Error occurred while creating an ai trip-story : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while generating a trip story !!");
    }
})


export { 
    createTripStory
}
