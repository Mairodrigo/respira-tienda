import Product from "../../models/Product.model.js";

class ProductRepository {
	// Crear un nuevo producto
	async create(data) {
		return Product.create(data);
	}

	// Obtener todos los productos, con filtro opcional
	async getAll(filter = {}) {
		return Product.find(filter).lean();
	}

	// Obtener un producto por su ID
	async getById(id) {
		return Product.findById(id).lean();
	}

	// Actualizar un producto
	async update(id, data) {
		return Product.findByIdAndUpdate(id, data, { new: true });
	}

	// Eliminar un producto
	async delete(id) {
		return Product.findByIdAndDelete(id);
	}

	// Actualizar stock de un producto
	async updateStock(id, newStock) {
		return Product.findByIdAndUpdate(id, { stock: newStock }, { new: true });
	}
}

export default new ProductRepository();
