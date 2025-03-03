import express from "express";
import Cart from "../models/Cart.model.js";
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

// ✅ GET /api/carts/:cid - Obtener carrito con productos completos
cartsRouter.get("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await Cart.findById(cid).populate("products.productId");

		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		res.status(200).json({ status: "success", payload: cart });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
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

// ✅ PUT /api/carts/:cid - Actualizar el carrito con un array de productos
cartsRouter.put("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;

		if (!Array.isArray(products)) {
			return res.status(400).json({
				status: "error",
				message:
					"El cuerpo de la solicitud debe contener un array de productos",
			});
		}

		const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });

		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		res.status(200).json({
			status: "success",
			message: "Carrito actualizado",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// ✅ PUT /api/carts/:cid/products/:pid - Actualizar la cantidad de un producto en el carrito
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;

		if (!quantity || quantity < 1) {
			return res.status(400).json({
				status: "error",
				message: "La cantidad debe ser un número mayor a 0",
			});
		}

		const cart = await Cart.findById(cid);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		const productIndex = cart.products.findIndex(
			(p) => p.productId.toString() === pid
		);
		if (productIndex === -1) {
			return res.status(404).json({
				status: "error",
				message: "Producto no encontrado en el carrito",
			});
		}

		cart.products[productIndex].quantity = quantity;
		await cart.save();

		res.status(200).json({
			status: "success",
			message: "Cantidad actualizada",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// ✅ DELETE /api/carts/:cid/products/:pid - Eliminar un producto del carrito
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const cart = await Cart.findById(cid);

		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		cart.products = cart.products.filter((p) => p.productId.toString() !== pid);
		await cart.save();

		res.status(200).json({
			status: "success",
			message: `Producto ${pid} eliminado del carrito`,
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// ✅ DELETE /api/carts/:cid - Vaciar el carrito por completo
cartsRouter.delete("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await Cart.findById(cid);

		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		cart.products = [];
		await cart.save();

		res
			.status(200)
			.json({ status: "success", message: "Carrito vaciado", payload: cart });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

export default cartsRouter;
