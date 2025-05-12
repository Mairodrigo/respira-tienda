import express from "express";
import {
	renderHome,
	renderProductDetail,
	renderCartDetail,
} from "../controllers/views.controller.js";

const router = express.Router();

router.get("/", renderHome);
router.get("/products/:pid", renderProductDetail);
router.get("/carts/:cid", renderCartDetail);

export default router;
