import express from "express";
import ProductManager from "../managers/ProductManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

//GET /api/products - Listar todos los productos
productsRouter.get("/", async (req, res) => {
	try {
		//Recupera los productos del archivo products.json
		const data = await productManager.getProducts();
		res.status(200).send(data);
	} catch (error) {
		res.status(500).send({ message: error.massage });
	}
});

// GET /api/products/:pid - Obtener un producto por su ID
productsRouter.get("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await productManager.getProductById(parseInt(pid));

		if (!product) {
			return res.status(404).json({ message: "Producto no encontrado" });
		}

		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// POST /api/products - Agregar un nuevo producto
productsRouter.post("/", async (req, res) => {
	try {
		const { title, description, code, price, status, stock, category, thumbnail } = req.body;

		// Validación básica: asegurarse de que los campos obligatorios estén presentes
		if (!title || !description || !code || !price || !stock || !category) {
			return res.status(400).json({ message: "Faltan campos obligatorios" });
		}

		// Crear el nuevo producto
		const newProduct = await productManager.addProduct({
			title,
			description,
			code,
			price,
			status: status !== undefined ? status : true, 
			stock,
			category,
			thumbnail: thumbnail || "" 
		});

		res.status(201).json({ message: "Producto agregado", product: newProduct });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// PUT /api/products/:pid - Modificar un producto por su ID
productsRouter.put("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const updatedFields = req.body;

		// Evitar que se intente modificar el ID
		if (updatedFields.id) {
			return res.status(400).json({ message: "No puedes modificar el ID del producto" });
		}

		const updatedProduct = await productManager.updateProductById(parseInt(pid), updatedFields);

		res.status(200).json({ message: "Producto actualizado", product: updatedProduct });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// DELETE /api/products/:pid - Eliminar un producto por su ID
productsRouter.delete("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		await productManager.deleteProductById(parseInt(pid));

		res.status(200).json({ message: `Producto con ID ${pid} eliminado.` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Exporta el router
export default productsRouter;
