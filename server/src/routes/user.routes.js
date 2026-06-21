import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, refreshAccessToken, register, resetPassword, updateUserAvatar, updateUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post( upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").get( verifyJWT, logout);
router.route("/me").get(getProfile);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/reset").post(forgotPassword);
router.route("/reset/:resetToken").post(resetPassword);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-profile").patch(verifyJWT, updateUserDetails);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;