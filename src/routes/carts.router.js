import express from "express";
import { authToken } from "../middlewares/auth.js";
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

// Ruta para crear un carrito
cartsRouter.post("/", authToken, createCart);


// Ruta para agregar un producto al carrito
cartsRouter.post("/:cid/products/:pid", authToken, addProductToCart);

// Resto de rutas para manejar el carrito
cartsRouter.get("/:cid", getCartById);
cartsRouter.put("/:cid", updateCart);
cartsRouter.put("/:cid/products/:pid", updateProductQuantity);
cartsRouter.delete("/:cid/products/:pid", deleteProductFromCart);
cartsRouter.delete("/:cid", emptyCart);

export default cartsRouter;
