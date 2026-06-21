import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";


const app = express();

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}))


app.use(morgan("dev"));
app.use(express.json({ limit : "10mb" }));
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(express.static("public"));


import userRoutes from "./routes/user.routes.js";
import memoryRoutes from "./routes/memory.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import bucketListRoutes from "./routes/bucketList.routes.js";
import timeCapsuleRoutes from "./routes/timeCapsule.routes.js";
import friendshipRoutes from "./routes/friendship.routes.js";
import tripStoryRoutes from "./routes/tripStory.routes.js";
import recommRoutes from "./routes/recommendations.routes.js";
import tripJournalRoutes from "./routes/tripJournal.routes.js";
import serverCheckRoutes from "./routes/serverCheck.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/ap/v1/health", serverCheckRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/memory", memoryRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/bucket-list", bucketListRoutes);
app.use("/api/v1/time-capsule", timeCapsuleRoutes);
app.use("/api/v1/friends", friendshipRoutes);
app.use("/api/v1/ai", tripStoryRoutes);
app.use("/api/v1/recomm", recommRoutes);
app.use("/api/v1/trip-journal", tripJournalRoutes);
app.use("/api/v1/admin", adminRoutes);

export { app };

