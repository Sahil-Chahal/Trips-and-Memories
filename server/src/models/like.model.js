import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    memory : {
        type : Schema.Types.ObjectId,
        ref : "Memory"
    },
    comment : {
        type : Schema.Types.ObjectId,
        ref : "Comment"
    }
}, {
    timestamps : true
})


export const Like = mongoose.model('Like', likeSchema);




