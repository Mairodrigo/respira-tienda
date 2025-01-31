import express from "express";
import ProductManager from "../managers/ProductManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

// Endpoint para obtener todos los productos
productsRouter.get("/", async (req, res) => {
	try {
		//Recupera los productos del archivo products.json
		const data = await productManager.getProducts();
		res.status(200).send(data);
	} catch (error) {
		res.status(500).send({ message: error.massage });
	}
});

// Endpoint para obtener un producto especifico segun el ID

// Endpoint para crear un nuevo producto

// Endpoint para modificar un producto

// Exporta el router
export default productsRouter;
