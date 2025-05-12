import { Router } from "express";
import { authToken } from "../middlewares/auth.js";
import {
	registerUser,
	loginUser,
	getCurrentUser,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authToken, getCurrentUser);

export default router;
