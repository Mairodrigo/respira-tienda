import OrderService from "../dao/services/order.service.js";

export const createOrder = async (req, res) => {
	try {
		const userId = req.user._id;
		const order = await OrderService.createOrderForUser(userId);
		res.status(201).json({
			status: "success",
			message: "Orden creada correctamente",
			order,
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: error.message,
		});
	}
};
