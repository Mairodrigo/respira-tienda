import express from "express";
import {
	authToken,
	authRole
} from "../middlewares/auth.js";
import { roleAuthorization } from "../middlewares/roleAuthorization.js";
import {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/products.controller.js";

const productsRouter = express.Router();

// Ruta publica - Obtener todos los productos
productsRouter.get("/", getProducts);

//Ruta publica - Obtener producto por id
productsRouter.get("/:pid", getProductById);

// Ruta solo admin - Crear producto
productsRouter.post(
	"/",
	authToken, 
	roleAuthorization(["admin"]),
	createProduct 
);


// Ruta solo admin - Actualizar producto
productsRouter.put(
	"/:id",
	roleAuthorization(["admin"]), 
	updateProduct
);

// Ruta solo para administradores
productsRouter.delete(
	"/:id",
	roleAuthorization(["admin"]), // Solo acceso para admin
	deleteProduct
);

export default productsRouter;
