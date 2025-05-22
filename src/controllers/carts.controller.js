import CartService from "../dao/services/cart.service.js";

export const createCart = async (req, res) => {
	try {
		if (!req.user || !req.user._id) {
			console.log("Usuario no autenticado en createCart");
			return res.status(401).json({
				status: "error",
				message: "Usuario no autenticado",
			});
		}

		const userId = req.user._id;
		console.log("Usuario autenticado, ID:", userId);

		const newCart = await CartService.createCart(userId);
		console.log("Carrito creado con user:", newCart.user);

		res
			.status(201)
			.json({ status: "success", message: "Carrito creado", cart: newCart });
	} catch (error) {
		console.error("Error en createCart:", error.message);
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

		const userId = req.user?._id;
		console.log("🧩 ID del usuario autenticado:", userId);

		if (!userId) {
			return res.status(401).json({
				status: "error",
				message: "Usuario no autenticado",
			});
		}

		const cart = await CartService.getCartById(cid);
		console.log("🛒 Carrito cargado:", JSON.stringify(cart, null, 2));

		if (!cart || !cart.user) {
			return res.status(404).json({
				status: "error",
				message: "Carrito no encontrado o no tiene usuario asociado",
			});
		}

		console.log(
			"🔍 Comparando:",
			cart.user.toString(),
			"===",
			userId.toString()
		);

		if (cart.user._id.toString() !== userId.toString()) {
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
		console.error("❌ Error en addProductToCart:", error);
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
