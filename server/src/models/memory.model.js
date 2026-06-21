import mongoose, { Schema } from "mongoose";

const memorySchema = new Schema({
    title : {
        type : String,
        required : [true, "Title of the Memory is required"],
        trim : true,
    },
    content : {
        type : String,
        required : [true, 'Content of the Memory is required'],
        trim : true
    },
    thumbnail : {
        public_id : {
            type : String,
            required : true,
        },
        secure_url : {
            type : String, 
            required : true,
        }
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    tripDate : {
        type : Date,
        default : Date.now,
    },
    location : {
        type : String,
        required : [true, "Location of the trip is required"],
        trim : true
    },
    tags : [
        {
            type : String,
            trim : true
        }
    ],
    category : {
        type : String,
        required : [true, "Category is required"],
        enum : ["Emotional", "Adventure", "Horror", "Funky", "Cute", "Romantic", "Spiritual", "Nature", "Foodie", "Wildlife", "Historical", "Cultural", "Luxury", "Eco-Friendly", "Urban", "Adventure Sports", "Travel", "Relaxation", "Family","Solo Travel", "Photogenic"]
    },
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    numberOfLikes : {
        type : Number,
        default : 0,
        minLength : [0, "Number of Likes can't be less than 0"]
    }


},{
    timestamps : true
})

export const Memory = mongoose.model("Memory", memorySchema);

