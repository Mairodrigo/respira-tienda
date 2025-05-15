import express from "express";
import { purchaseCart } from "../controllers/purchase.controller.js";
import {authToken, authRole} from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authToken, authRole(["user"]), purchaseCart);

export default router;