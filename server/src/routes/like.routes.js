import { Router } from "express";
import { toggleCommentLike, toggleMemoryLike } from "../controllers/like.controller.js";
import {verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/m/:memoryId")
.get(toggleMemoryLike);

router.route("/toggle/c/:commentId")
.get(toggleCommentLike);



export default router;
