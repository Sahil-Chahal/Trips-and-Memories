import mongoose, {Schema} from "mongoose";

const timeCapsuleSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : [true, "Title of the Time Capsule is required!!"]
    },
    description : {
        type : String,
        required : [true, "Description of the Time Capsule is required"]
    },
    openDate : {
        type : Date,
        required : [true, "Opening date of the time capsule is required"]
    },
    isUnlocked :{
        type : Boolean,
        default : false
    },
    memoryText : {
        type : String,
        required : [true, "The Text for the memory of time capsule is required"],
    },
    memoryImg : {
        public_id : {
            type : String,
        },
        secure_url : {
            type : String,
        }
    },
    memoryDescription : {
        type : String,
        required : [true, "The description of memory is required for the time capsule"]
    }
}, {
    timestamps : true
})


export const TimeCapsule = mongoose.model("TimeCapsule", timeCapsuleSchema);


