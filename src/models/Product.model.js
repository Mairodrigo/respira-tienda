import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	code: { type: String, unique: true, required: true },
	price: { type: Number, required: true },
	status: { type: Boolean, default: true },
	stock: { type: Number, required: true },
	category: { type: String, required: true },
	thumbnail: { type: String, default: "" },
});

//Aplicar paginación
productSchema.plugin(mongoosePaginate);

// Modelo con paginación
const Product = mongoose.model("Product", productSchema);

export default Product;
