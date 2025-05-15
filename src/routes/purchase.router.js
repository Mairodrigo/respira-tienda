import express from "express";
import { purchaseCart } from "../controllers/purchase.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware(["user"]), purchaseCart);

export default router;
