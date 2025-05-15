import { Router } from "express";
import { authToken } from "../middlewares/auth.js";
import { roleAuthorization } from "../middlewares/roleAuthorization.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

// Solo usuarios con rol "user" pueden crear órdenes
router.post("/", authToken, roleAuthorization(["user"]), createOrder);

export default router;
