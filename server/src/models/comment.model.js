import mongoose, { Schema } from "mongoose";


const commentSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    content : {
        type : String,
        required : [true, "Comment Content is required.."],
        trim : true
    },
    memory : {
        type : Schema.Types.ObjectId,
        ref : "Memory"
    },
    numberOfLikes : {
        type : Number,
        default : 0,
        minLength : [0, "Number of Likes can't be less than 0"]
    }
},{
    timestamps : true
});



export const Comment = mongoose.model("Comment", commentSchema);

