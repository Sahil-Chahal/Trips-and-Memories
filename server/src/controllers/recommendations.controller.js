import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Memory } from "../models/memory.model.js";


const provideRecommendations = asyncHandler(async(req, res, next) => {
    try{
        const userId = req?.user?._id;
        console.log(userId);

        const prevTrips = await Memory.find({ author : userId }).sort({ createdAt : -1 }).limit(5);

        if(prevTrips.length !== 5){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    prevTrips,
                    "You don't have the required number of trips for recommendations !!"
                )
            )
        }

        const categoryCount = {};
        prevTrips.forEach((ele) => {
            const category = ele.category;
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        })

        const categories = Object.keys(categoryCount);
        const uniqueCount = new Set(Object.values(categoryCount));

        let mostCommonCategory;
        if(uniqueCount.size == 1){
            mostCommonCategory = categories[Math.floor(Math.random() * categories.length)];
        }else{
            mostCommonCategory = categories.reduce((a,b) => categoryCount[a] > categoryCount[b] ? a : b);
        }

        const recommendedTrips = await Memory.aggregate([
            {
                $match : {
                    category : mostCommonCategory,
                    author: { $ne: userId }
                }
            },
            {$sample : {size : 5}}
        ]);


        return res.status(200).json(
            new ApiResponse(
                200,
                recommendedTrips,
                "Here are some recommendations for you!!"
            )
        )



    }catch(err){
        console.error(`Error occurred while providing recommendations to the user : ${err}`);
        throw new ApiError(400, err?.message || "Error occurred while providing recommendations !!");
    }
})




export {
    provideRecommendations
}
