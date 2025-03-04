import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";

const cartsRouter = express.Router();

// ✅ POST /api/carts - Crear un nuevo carrito vacío
cartsRouter.post("/", async (req, res) => {
	try {
		const newCart = await Cart.create({ products: [] }); // Crear carrito vacío
		res.status(201).json({ message: "Carrito creado", cart: newCart });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// ✅ POST /api/carts/:cid/products/:pid - Agregar un producto al carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const quantity = Number(req.body.quantity) || 1;

		// Validar que los IDs sean válidos de MongoDB
		if (
			!mongoose.Types.ObjectId.isValid(cid) ||
			!mongoose.Types.ObjectId.isValid(pid)
		) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

		// Buscar el carrito en MongoDB
		const cart = await Cart.findById(cid);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		// Buscar si el producto ya está en el carrito
		const productIndex = cart.products.findIndex(
			(p) => p.productId.toString() === pid
		);

		if (productIndex !== -1) {
			// Si el producto ya existe, aumentar la cantidad
			cart.products[productIndex].quantity += quantity;
		} else {
			// Si no existe, agregarlo con ObjectId
			cart.products.push({
				productId: new mongoose.Types.ObjectId(pid),
				quantity,
			});
		}

		await cart.save();

		res.status(200).json({
			status: "success",
			message: "Producto agregado al carrito",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

export default cartsRouter;
