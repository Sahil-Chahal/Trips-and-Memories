import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { fetchUsersCount, fetchMemoriesCount, fetchMemories, fetchAllUsers, fetchUserById, updateUserById, deleteUserById, deleteMemoryById, deleteCommentById, fetchComments, fetchCommentsCount, fetchLikes, fetchLikesCount, fetchLikeById, updateLikeById, deleteLikeById, fetchPopularLocations, fetchMemoryOverTime, fetchCategoryStats, fetchUserEngagements, fetchUserGrowthStats, fetchMemoryEngagementStats, fetchJournalCount, fetchBucketListCount, fetchtimeCapsulesCount} from "../controllers/admin.controllers.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);


router.route("/fetch-users-count").get(fetchUsersCount);
router.route("/fetch-memories-count").get(fetchMemoriesCount);
router.route("/fetch-memories").get(fetchMemories);
router.route("/delete-memory/:memoryId").delete(deleteMemoryById);


router.route("/fetch-users").get(fetchAllUsers);
router.route("/fetch-user/:userId").get(fetchUserById);
router.route("/update-user/:userId").put(updateUserById);
router.route("/delete-user/:userId").delete(deleteUserById);


router.route("/delete-comment/:commentId").delete(deleteCommentById);
router.route("/fetch-comments").get(fetchComments);
router.route("/fetch-comments-count").get(fetchCommentsCount);

router.route("/fetch-journal-count").get(fetchJournalCount);
router.route("/fetch-bucket-list-count").get(fetchBucketListCount);
router.route("/fetch-time-capsules-count").get(fetchtimeCapsulesCount);


router.route("/fetch-likes").get(fetchLikes);
router.route("/fetch-likes-count").get(fetchLikesCount);
router.route("/fetch-like/:likeId").get(fetchLikeById);
router.route("/update-like/:likeId").put(updateLikeById);
router.route("/delete-like/:likeId").delete(deleteLikeById);


router.route("/fetch-locations-stats").get(fetchPopularLocations);
router.route("/fetch-category-stats").get(fetchCategoryStats);
router.route("/fetch-memory-stats").get(fetchMemoryOverTime);
router.route("/fetch-user-engagement-stats").get(fetchUserEngagements);
router.route("/fetch-user-growth-stats").get(fetchUserGrowthStats);
router.route("/fetch-memory-engagement-stats").get(fetchMemoryEngagementStats);


export default router;


