import CartRepository from "../dao/repositories/Cart.repository.js";
import ProductRepository from "../dao/repositories/Product.repository.js";
import mongoose from "mongoose";

class CartService {
	async createCart(userId = null) {
		return await CartRepository.create(userId);
	}

	async getCartById(cartId) {
		if (!mongoose.Types.ObjectId.isValid(cartId))
			throw new Error("ID de carrito inválido");
		const cart = await CartRepository.getById(cartId);
		if (!cart) throw new Error("Carrito no encontrado");
		return cart;
	}

	async addProductToCart(cartId, productId, quantity = 1) {
		if (
			!mongoose.Types.ObjectId.isValid(cartId) ||
			!mongoose.Types.ObjectId.isValid(productId)
		) {
			throw new Error("ID inválido");
		}

		// Validar existencia y stock del producto
		const product = await ProductRepository.getById(productId);
		if (!product) throw new Error("Producto no encontrado");
		if (product.stock < quantity) throw new Error("Stock insuficiente");

		const updatedCart = await CartRepository.addProduct(
			cartId,
			productId,
			quantity
		);
		if (!updatedCart) throw new Error("No se pudo agregar el producto");

		// TODO: actualizar stock en Product si querés que sea inmediato
		// await ProductRepository.updateStock(productId, product.stock - quantity);

		return updatedCart;
	}

	async updateCart(cartId, newProducts) {
		if (!mongoose.Types.ObjectId.isValid(cartId))
			throw new Error("ID de carrito inválido");

		// Validar que los productos existan
		for (const item of newProducts) {
			const product = await ProductRepository.getById(item.productId);
			if (!product)
				throw new Error(`Producto no encontrado: ${item.productId}`);
			if (item.quantity > product.stock)
				throw new Error(`Stock insuficiente para ${product.title}`);
		}

		return await CartRepository.updateCart(cartId, newProducts);
	}

	async updateProductQuantity(cartId, productId, quantity) {
		if (
			!mongoose.Types.ObjectId.isValid(cartId) ||
			!mongoose.Types.ObjectId.isValid(productId)
		) {
			throw new Error("ID inválido");
		}

		const product = await ProductRepository.getById(productId);
		if (!product) throw new Error("Producto no encontrado");
		if (quantity > product.stock) throw new Error("Stock insuficiente");

		const cart = await CartRepository.updateProductQuantity(
			cartId,
			productId,
			quantity
		);
		if (!cart) throw new Error("Producto no encontrado en el carrito");

		return cart;
	}

	async removeProduct(cartId, productId) {
		if (
			!mongoose.Types.ObjectId.isValid(cartId) ||
			!mongoose.Types.ObjectId.isValid(productId)
		) {
			throw new Error("ID inválido");
		}

		const cart = await CartRepository.removeProduct(cartId, productId);
		if (!cart) throw new Error("Carrito no encontrado");
		return cart;
	}

	async emptyCart(cartId) {
		if (!mongoose.Types.ObjectId.isValid(cartId))
			throw new Error("ID inválido");
		const cart = await CartRepository.clearCart(cartId);
		if (!cart) throw new Error("Carrito no encontrado");
		return cart;
	}
}

export default new CartService();
