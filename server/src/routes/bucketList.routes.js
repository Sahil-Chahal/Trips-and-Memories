import { Router } from "express";
import { clearBucketList, getAllBucketListItems, toggleBucketListItem } from "../controllers/bucketList.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

router.route("/toggle/:memoryId")
.get(toggleBucketListItem);

router.route("/clear")
.get(clearBucketList);

router.route("/getall")
.get(getAllBucketListItems);


export default router;

