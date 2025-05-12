import express from "express";
import {
	createCart,
	addProductToCart,
	getCartById,
	updateCart,
	updateProductQuantity,
	deleteProductFromCart,
	emptyCart,
} from "../controllers/carts.controller.js";

const cartsRouter = express.Router();

cartsRouter.post("/", createCart);
cartsRouter.post("/:cid/products/:pid", addProductToCart);
cartsRouter.get("/:cid", getCartById);
cartsRouter.put("/:cid", updateCart);
cartsRouter.put("/:cid/products/:pid", updateProductQuantity);
cartsRouter.delete("/:cid/products/:pid", deleteProductFromCart);
cartsRouter.delete("/:cid", emptyCart);

export default cartsRouter;
