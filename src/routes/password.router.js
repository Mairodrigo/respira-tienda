import { Router } from "express";
import {
	resetPassword,
	requestPasswordReset,
	renderResetForm,
} from "../controllers/password.controller.js";

const router = Router();

router.post("/request-reset", requestPasswordReset);
router.get("/reset-password", renderResetForm);
router.post("/reset-password", resetPassword);

export default router;
