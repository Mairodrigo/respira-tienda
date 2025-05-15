import ProductRepository from "../dao/repositories/Product.repository.js";
import TicketService from "../dao/services/ticket.service.js";
import CartRepository from "../dao/repositories/Cart.repository.js"; 

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

		// Procesar la compra
		const { successfulPurchases, rejectedProducts } =
			await PurchaseService.processPurchase(cart);

		return res.status(200).json({
			status: "success",
			message: "Compra procesada",
			successfulPurchases,
			rejectedProducts,
		});
	} catch (error) {
		console.error("Error en purchaseCart:", error);
		return res
			.status(500)
			.json({ status: "error", message: "Error al procesar la compra" });
	}
};

export default new PurchaseService();
