import { Router } from "express";

import { acceptFriendRequest, cancelFriendRequest, declineFriendRequest, getPendingRequests, listAllFriends, removeFriend, searchFriendsByUsername, sendFriendRequest } from "../controllers/friendship.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/request/:recipientId")
.get(sendFriendRequest);

router.route("/request/cancel/:requestId")
.delete(cancelFriendRequest);

router.route("/search-query")
.get(searchFriendsByUsername);

router.route("/accept/:requestId")
.get(acceptFriendRequest);

router.route("/decline/:requestId")
.get(declineFriendRequest);

router.route("/requests-pending")
.get(getPendingRequests);

router.route("/remove/:friendId")
.delete(removeFriend);

router.route("/list")
.get(listAllFriends);




export default router;
