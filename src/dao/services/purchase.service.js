import ProductRepository from "../repositories/Product.repository.js";
import TicketService from "./ticket.service.js";

class PurchaseService {
	async processPurchase(cart) {
		const userEmail = cart.user.email || "sin-email"; // Asegura que haya un email

		const successfulPurchases = [];
		const rejectedProducts = [];
		let totalAmount = 0;

		for (const item of cart.products) {
			const product = item.productId;
			const quantity = item.quantity;

			if (product.stock >= quantity) {
				// Stock suficiente
				successfulPurchases.push({
					product: product._id,
					quantity,
					price: product.price,
				});
				totalAmount += quantity * product.price;

				await ProductRepository.updateStock(
					product._id,
					product.stock - quantity
				);
			} else {
				// Stock insuficiente
				rejectedProducts.push({
					product: product._id,
					requested: quantity,
					available: product.stock,
				});
			}
		}

		// Generar ticket si hubo compras exitosas
		if (successfulPurchases.length > 0) {
			await TicketService.generateTicket({
				purchaser: userEmail,
				amount: totalAmount,
				products: successfulPurchases.map((p) => ({
					product: p.product,
					quantity: p.quantity,
				})),
			});

			// Eliminar productos comprados del carrito
			cart.products = cart.products.filter(
				(item) =>
					!successfulPurchases.some((p) => p.product.equals(item.productId._id))
			);
			await cart.save();
		}

		return { successfulPurchases, rejectedProducts };
	}
}

export default new PurchaseService();
