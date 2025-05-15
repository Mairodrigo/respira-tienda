import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
	},
	purchase_datetime: {
		type: Date,
		default: Date.now,
	},
	amount: {
		type: Number,
		required: true,
	},
	purchaser: {
		type: String,
		required: true, // Usualmente es el email del comprador
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product", // Asegurate de que este modelo exista
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
		},
	],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
