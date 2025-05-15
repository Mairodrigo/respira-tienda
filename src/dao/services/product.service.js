// src/services/product.service.js

import productRepo from "../dao/repositories/product.repository.js";

class ProductService {
	async createProduct(data) {
		return productRepo.create(data);
	}

	async getProduct(id) {
		const product = await productRepo.getById(id);
		if (!product) throw new Error("Producto no encontrado");
		return product;
	}

	async listProducts(filter) {
		return productRepo.getAll(filter);
	}

	async updateProduct(id, data) {
		const updated = await productRepo.update(id, data);
		if (!updated) throw new Error("No se pudo actualizar el producto");
		return updated;
	}

	async deleteProduct(id) {
		const deleted = await productRepo.delete(id);
		if (!deleted) throw new Error("No se pudo eliminar el producto");
		return deleted;
	}
}

export default new ProductService();
