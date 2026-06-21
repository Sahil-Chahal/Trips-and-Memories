
import mongoose, { Schema } from "mongoose";

const tripJournalSchema = new Schema({
    title: {
        type: String,
        required: [true, "Journal Title is required"],
    },
    description: {
        type: String,
        required: [true, "Journal description is required"],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Journal Owner is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
    contributors: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    entries: [
        {
            contributor: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: [true, "Contributor is required"],
            },
            content: {
                type: String,
                required: [true, "Entry Content is required"],
            },
            images: [
                {
                    public_id: {
                        type: String,
                        required: true,
                    },
                    secure_url: {
                        type: String,
                        required: true,
                    },
                },
            ],
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    aiGeneratedStory: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});


tripJournalSchema.index({ contributors: 1 }, { unique: false });

export const TripJournal = mongoose.model("TripJournal", tripJournalSchema);
