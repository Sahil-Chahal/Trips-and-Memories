import { Router } from "express";
import { createTimeCapsule, deleteTimeCapsule, fetchAllTimeCapsulesofUser, fetchTimeCapsuleDetails } from "../controllers/timeCapsule.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);


router.route("/create")
.post( upload.single('memoryImg') ,createTimeCapsule);


router.route("/get/my")
.get(fetchAllTimeCapsulesofUser);


router.route("/get/:capsuleId")
.get(fetchTimeCapsuleDetails);

router.route("/delete/:capsuleId")
.delete(deleteTimeCapsule);




export default router;