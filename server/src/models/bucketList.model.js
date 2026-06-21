import mongoose, { Schema } from "mongoose";


const bucketListSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    memory : {
        type : Schema.Types.ObjectId,
        ref : "Memory"
    },
}, {
    timestamps : true
})



export const BucketList = mongoose.model("BucketList", bucketListSchema);





