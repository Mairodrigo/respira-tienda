import express from "express";
import { roleAuthorization } from "../middlewares/roleAuthorization.js";
import {
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/products.controller.js";

const productsRouter = express.Router();

// Ruta solo para administradores
productsRouter.post(
	"/create",
	roleAuthorization(["admin"]), // Solo acceso para admin
	createProduct
);

// Ruta solo para administradores
productsRouter.put(
	"/update/:id",
	roleAuthorization(["admin"]), // Solo acceso para admin
	updateProduct
);

// Ruta solo para administradores
productsRouter.delete(
	"/delete/:id",
	roleAuthorization(["admin"]), // Solo acceso para admin
	deleteProduct
);

export default productsRouter;
