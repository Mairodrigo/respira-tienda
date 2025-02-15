import express from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = express.Router();
const productsManager = new ProductManager("./src/data/products.json");

// Renderiza la vista principal con todos los productos
viewsRouter.get("/", async (req, res) => {
	try {
		const products = await productsManager.getProducts();
		res.render("home", { products });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

// Renderiza la vista con WebSocket
viewsRouter.get("/realtimeproducts", async (req, res) => {
	try {
		const products = await productsManager.getProducts();
		res.render("realTimeProducts", { products });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

export default viewsRouter;
