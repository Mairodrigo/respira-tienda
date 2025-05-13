import { Router } from "express";
import { forgotPassword } from "../controllers/password.controller.js";
import { resetPassword } from "../controllers/password.controller.js";

const router = Router();

// Envío del email con link de recuperación
router.post("/forgot-password", forgotPassword);

// Ruta para recibir el nuevo password y token
router.post("/reset-password", resetPassword);

export default router;
