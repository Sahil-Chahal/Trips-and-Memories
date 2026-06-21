import { Router } from "express";
import { checkServerHealth } from "../controllers/serverCheck.controllers.js";

const router = Router();


router.get("/server-check", checkServerHealth);

export default router;
