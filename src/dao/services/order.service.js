import productRepo from "../dao/repositories/Product.repository.js";
import cartRepo from "../dao/repositories/Cart.repository.js";
import orderRepo from "../dao/repositories/Order.repository.js";

class OrderService {
	async createOrderForUser(userId) {
		// 1. Obtener carrito con products.productId populated
		const cart = await cartRepo.getByUserId(userId);
		if (!cart || cart.products.length === 0) {
			throw new Error("Carrito vacío o no existente");
		}

		// 2. Verificar stock y calcular monto total
		let total = 0;
		const orderProducts = [];

		for (const item of cart.products) {
			const prod = item.productId;
			if (item.quantity > prod.stock) {
				throw new Error(`Stock insuficiente para ${prod.title}`);
			}
			total += prod.price * item.quantity;
			orderProducts.push({
				product: prod._id,
				quantity: item.quantity,
				price: prod.price,
			});
		}

		// 3. Descontar stock
		for (const op of orderProducts) {
			const prod = await productRepo.getById(op.product);
			await productRepo.updateStock(op.product, prod.stock - op.quantity);
		}

		// 4. Crear la orden
		const order = await orderRepo.create({
			user: userId,
			products: orderProducts,
			totalAmount: total,
		});

		// 5. Vaciar carrito
		await cartRepo.clearCart(cart._id);

		return order;
	}
}

export default new OrderService();
