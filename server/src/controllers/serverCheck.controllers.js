import { asyncHandler } from "../utils/asyncHandler.js";

const checkServerHealth = asyncHandler(async(req, res, next) => {
    try{
        return res.status(200).json("Server health is ok !");
    }catch(err){
        console.error(`error occurred while checking server health : ${err}`);
        return res.status(400).json("Error occurred at server");
    }
})

export { 
    checkServerHealth
}
