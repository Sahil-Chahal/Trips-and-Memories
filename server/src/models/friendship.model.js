import mongoose, { Schema } from "mongoose";

const friendshipSchema = new Schema({
    requester : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "The person who has sent the friend request is required"]
    },
    recipient : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "The recipient of the Friend request is required"]
    },
    status : {
        type : String,
        enum : ['pending', 'accepted', 'declined'],
        default : 'pending'
    }
}, {
    timestamps : true
}) 


export const Friendship = mongoose.model("Friendship", friendshipSchema);

