import express from "express";
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = express.Router();
const productsManager = new ProductManager("./src/data/products.json");

viewsRouter.get("/", async (req, res) => {
	try {
		const products = await productsManager.getProducts();
		res.render("home", { products });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

export default viewsRouter;
