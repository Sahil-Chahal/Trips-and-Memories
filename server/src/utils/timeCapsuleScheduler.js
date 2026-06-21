import cron from "node-cron";
import mongoose from "mongoose";
import { asyncHandler } from "./asyncHandler.js";
import { TimeCapsule } from "../models/timeCapsule.model.js";

const unlockTimeCapsules = asyncHandler(async () => {
    try {
        console.log("UnlockTimeCapsules function running...");

        const now = new Date();
        console.log("Current time:", now);

        // Debugging: Log the query conditions
        const query = { openDate: { $lte: now }, isUnlocked: false };
        // console.log("Query conditions:", query);

        const capsulesToUnlock = await TimeCapsule.find(query);

        // console.log("Capsules to unlock:", capsulesToUnlock);

        if (capsulesToUnlock.length > 0) {
            const idsToUpdate = capsulesToUnlock.map((capsule) => capsule._id);
            console.log("IDs to update:", idsToUpdate);

            const updateResult = await TimeCapsule.updateMany(
                { _id: { $in: idsToUpdate } },
                { isUnlocked: true }
            );

            console.log("Update result:", updateResult);
        } else {
            console.log("No capsules to unlock at this time.");
        }
    } catch (err) {
        console.error("Error while unlocking capsules:", err);
    }
});


export const scheduleUnlockJob = async () => {
    console.log("Initializing cron job...");

    // Schedule the cron job to run daily at midnight
    cron.schedule("*/5 * * * *", async () => { // Runs every 5 minutes
        console.log("Testing cron job execution...");
        await unlockTimeCapsules();
    });
    

    console.log("Cron job scheduled.");
};
