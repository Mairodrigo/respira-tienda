import express from "express";
import CartManager from "../managers/CartManager.js";

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

// ✅ GET /api/carts - Obtener todos los carritos
cartsRouter.get("/", async (req, res) => {
	try {
		const carts = await cartManager.getCarts();
		res.status(200).json(carts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// ✅ POST /api/carts - Crear un nuevo carrito
cartsRouter.post("/", async (req, res) => {
	try {
		const newCart = await cartManager.addCart();
		res.status(201).json({ message: "Carrito creado", cart: newCart });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});


// ✅ GET /api/carts/:cid - Obtener un carrito por ID
cartsRouter.get("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await cartManager.getCartById(parseInt(cid));

		if (!cart) {
			return res.status(404).json({ message: "Carrito no encontrado" });
		}

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// ✅ POST /api/carts/:cid/products/:pid - Agregar un producto a un carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body; // La cantidad puede ser enviada en el body, si no, será 1

		const updatedCart = await cartManager.addProductInCartById(
			parseInt(cid),
			parseInt(pid),
			quantity || 1
		);

		res
			.status(200)
			.json({ message: "Producto agregado al carrito", cart: updatedCart });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default cartsRouter;
