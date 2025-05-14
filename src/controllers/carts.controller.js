import CartService from "../services/cart.service.js";

export const createCart = async (req, res) => {
	try {
		const userId = req.user?._id || null;
		const newCart = await CartService.createCart(userId);
		res
			.status(201)
			.json({ status: "success", message: "Carrito creado", cart: newCart });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

export const getCartById = async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await CartService.getCartById(cid);
		res.status(200).json({ status: "success", payload: cart });
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const quantity = Number(req.body.quantity) || 1;
		const userId = req.user._id;

		const cart = await CartService.getCartById(cid);

		if (cart.user.toString() !== userId.toString()) {
			return res.status(403).json({
				status: "error",
				message: "No tienes permisos para acceder a este carrito",
			});
		}

		const updatedCart = await CartService.addProductToCart(cid, pid, quantity);

		res.status(200).json({
			status: "success",
			message: "Producto agregado al carrito",
			payload: updatedCart,
		});
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

export const updateCart = async (req, res) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;

		const updatedCart = await CartService.updateCart(cid, products);

		res.status(200).json({
			status: "success",
			message: "Carrito actualizado",
			payload: updatedCart,
		});
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

export const updateProductQuantity = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;

		const updatedCart = await CartService.updateProductQuantity(
			cid,
			pid,
			quantity
		);

		res.status(200).json({
			status: "success",
			message: "Cantidad actualizada",
			payload: updatedCart,
		});
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

export const deleteProductFromCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;

		const updatedCart = await CartService.removeProduct(cid, pid);

		res.status(200).json({
			status: "success",
			message: "Producto eliminado",
			payload: updatedCart,
		});
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};

export const emptyCart = async (req, res) => {
	try {
		const { cid } = req.params;

		await CartService.emptyCart(cid);

		res.status(200).json({ status: "success", message: "Carrito vaciado" });
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
};
