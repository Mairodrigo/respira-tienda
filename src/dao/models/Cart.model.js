import mongoose from "mongoose";

// Esquema del carrito
const cartSchema = new mongoose.Schema(
	{
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product", // Referencia al modelo de producto
					required: true,
				},
				quantity: {
					type: Number,
					default: 1,
					min: [1, "La cantidad debe ser al menos 1"],
				},
			},
		],
	},
	{ timestamps: true } // Añade createdAt y updatedAt
);

// Evita redefinir el modelo si ya existe
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
