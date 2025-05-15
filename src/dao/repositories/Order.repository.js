import Order from "../../models/Order.model.js";

class OrderRepository {
	async create(orderData) {
		return Order.create(orderData);
	}
}

export default new OrderRepository();
