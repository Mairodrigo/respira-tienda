import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";

class CartRepository {
	// Crear carrito (opcionalmente con ID de usuario)
	async create(userId = null) {
		const cartData = userId ? { user: userId, products: [] } : { products: [] };
		return Cart.create(cartData);
	}

	// Obtener carrito por ID
	async getById(cartId) {
		return Cart.findById(cartId).populate("products.productId");
	}

	// Obtener carrito por usuario
	async getByUserId(userId) {
		return Cart.findOne({ user: userId }).populate("products.productId");
	}

	// Reemplazar todos los productos del carrito
	async updateCart(cartId, products) {
		return Cart.findByIdAndUpdate(cartId, { products }, { new: true });
	}

	// Agregar o incrementar un producto en el carrito
	async addProduct(cartId, productId, quantity = 1) {
		const cart = await Cart.findById(cartId);
		if (!cart) return null;

		const index = cart.products.findIndex(
			(p) => p.productId.toString() === productId
		);
		if (index !== -1) {
			cart.products[index].quantity += quantity;
		} else {
			cart.products.push({
				productId: new mongoose.Types.ObjectId(productId),
				quantity,
			});
		}

		await cart.save();
		return cart;
	}

	// Actualizar cantidad específica de un producto
	async updateProductQuantity(cartId, productId, quantity) {
		const cart = await Cart.findById(cartId);
		if (!cart) return null;

		const product = cart.products.find(
			(p) => p.productId.toString() === productId
		);
		if (!product) return null;

		product.quantity = quantity;
		await cart.save();
		return cart;
	}

	// Eliminar producto del carrito
	async removeProduct(cartId, productId) {
		const cart = await Cart.findById(cartId);
		if (!cart) return null;

		cart.products = cart.products.filter(
			(p) => p.productId.toString() !== productId
		);
		await cart.save();
		return cart;
	}

	// Vaciar carrito
	async clearCart(cartId) {
		return Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
	}
}

export default new CartRepository();
