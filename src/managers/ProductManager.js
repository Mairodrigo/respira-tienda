import Product from "../models/Product.model.js";

class ProductManager {
	// Obtener todos los productos
	async getProducts() {
		try {
			const products = await Product.find().lean();
			return products;
		} catch (error) {
			throw new Error("Error al obtener productos: " + error.message);
		}
	}

	// Agregar un nuevo producto
	async addProduct(productData) {
		try {
			const newProduct = await Product.create(productData);
			return newProduct;
		} catch (error) {
			throw new Error("Error al agregar producto: " + error.message);
		}
	}

	// Actualizar un producto por ID
	async updateProductById(id, updatedFields) {
		try {
			const updatedProduct = await Product.findByIdAndUpdate(
				id,
				updatedFields,
				{ new: true }
			);
			return updatedProduct;
		} catch (error) {
			throw new Error("Error al actualizar producto: " + error.message);
		}
	}

	// Eliminar un producto por ID
	async deleteProductById(id) {
		try {
			const deletedProduct = await Product.findByIdAndDelete(id);
			return deletedProduct;
		} catch (error) {
			throw new Error("Error al eliminar producto: " + error.message);
		}
	}
}

export default ProductManager;