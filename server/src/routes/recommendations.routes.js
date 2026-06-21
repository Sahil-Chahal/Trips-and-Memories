import { Router } from "express";
import { provideRecommendations } from "../controllers/recommendations.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

router.route("/get-recomm")
.get(provideRecommendations);



export default router;
