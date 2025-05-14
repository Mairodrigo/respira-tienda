import mongoose from "mongoose";
import CartRepository from "../repositories/Cart.repository.js";
import PurchaseService from "../services/purchase.service.js";

export const purchaseCart = async (req, res) => {
	try {
		const userId = req.user._id;

		// Obtener el carrito del usuario
		const cart = await CartRepository.getByUserId(userId);
		if (!cart) {
			return res
				.status(404)
				.json({ status: "error", message: "Carrito no encontrado" });
		}

		if (!cart.products || cart.products.length === 0) {
			return res
				.status(400)
				.json({ status: "error", message: "El carrito está vacío" });
		}

		// Procesar la compra usando el servicio
		const { successfulPurchases, rejectedProducts } =
			await PurchaseService.processPurchase(cart);

		res.status(200).json({
			status: "success",
			message: "Compra procesada",
			successfulPurchases,
			rejectedProducts,
		});
	} catch (error) {
		console.error("Error en purchaseCart:", error.message);
		res
			.status(500)
			.json({ status: "error", message: "Error al procesar la compra" });
	}
};
