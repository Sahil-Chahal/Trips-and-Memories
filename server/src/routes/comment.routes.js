import { Router } from "express";
import { addComment, deleteComment, fetchAllComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/add/:memoryId")
.post( verifyJWT, addComment);

router.route("/delete/:commentId")
.delete( verifyJWT, deleteComment);

router.route("/fetch/:memoryId")
.get(fetchAllComments);

export default router;