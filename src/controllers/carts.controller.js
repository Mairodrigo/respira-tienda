import mongoose from "mongoose";
import Cart from "../dao/models/Cart.model.js";

// Crear carrito
export const createCart = async (req, res) => {
	try {
		const newCart = await Cart.create({ products: [] });
		res
			.status(201)
			.json({ status: "success", message: "Carrito creado", cart: newCart });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Agregar producto al carrito
export const addProductToCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const quantity = Number(req.body.quantity) || 1;
		const userId = req.user._id;  // Obtener el ID del usuario autenticado

		// Verificar si los IDs son válidos
		if (
			!mongoose.Types.ObjectId.isValid(cid) ||
			!mongoose.Types.ObjectId.isValid(pid)
		) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

		// Obtener el carrito de la base de datos
		const cart = await Cart.findById(cid);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		// Verificar si el carrito pertenece al usuario autenticado
		if (cart.user.toString() !== userId.toString()) {
			return res.status(403).json({
				status: "error",
				message: "No tienes permisos para acceder a este carrito",
			});
		}

		// Buscar si el producto ya está en el carrito
		const index = cart.products.findIndex(
			(p) => p.productId.toString() === pid
		);
		if (index !== -1) {
			// Si ya está, aumentar la cantidad
			cart.products[index].quantity += quantity;
		} else {
			// Si no está, agregarlo al carrito
			cart.products.push({
				productId: new mongoose.Types.ObjectId(pid),
				quantity,
			});
		}

		// Guardar el carrito actualizado
		await cart.save();
		res.status(200).json({
			status: "success",
			message: "Producto agregado al carrito",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Obtener carrito con populate
export const getCartById = async (req, res) => {
	try {
		const { cid } = req.params;

		if (!mongoose.Types.ObjectId.isValid(cid)) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

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
};

// Actualizar todo el carrito
export const updateCart = async (req, res) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;

		if (!mongoose.Types.ObjectId.isValid(cid)) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

		const cart = await Cart.findById(cid);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		cart.products = products;
		await cart.save();

		res.status(200).json({
			status: "success",
			message: "Carrito actualizado",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Actualizar cantidad de producto
export const updateProductQuantity = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;

		if (
			!mongoose.Types.ObjectId.isValid(cid) ||
			!mongoose.Types.ObjectId.isValid(pid)
		) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

		const cart = await Cart.findById(cid);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		const product = cart.products.find((p) => p.productId.toString() === pid);
		if (!product) {
			return res.status(404).json({
				status: "error",
				message: "Producto no encontrado en el carrito",
			});
		}

		product.quantity = quantity;
		await cart.save();

		res.status(200).json({
			status: "success",
			message: "Cantidad actualizada",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Eliminar producto del carrito
export const deleteProductFromCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;

		if (
			!mongoose.Types.ObjectId.isValid(cid) ||
			!mongoose.Types.ObjectId.isValid(pid)
		) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

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
			message: "Producto eliminado",
			payload: cart,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Vaciar carrito
export const emptyCart = async (req, res) => {
	try {
		const { cid } = req.params;

		if (!mongoose.Types.ObjectId.isValid(cid)) {
			return res.status(400).json({ status: "error", message: "ID inválido" });
		}

		const cart = await Cart.findById(cid);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		cart.products = [];
		await cart.save();

		res.status(200).json({ status: "success", message: "Carrito vaciado" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};
