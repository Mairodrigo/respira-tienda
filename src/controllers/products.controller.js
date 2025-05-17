// controllers/products.controller.js
import Product from "../models/Product.model.js";

// GET /api/products
export const getProducts = async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query } = req.query;

		const filter = getFilterOption(query);
		const options = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort: getSortOption(sort),
		};

		const products = await Product.paginate(filter, options);

		const buildLink = (targetPage) =>
			`/api/products?page=${targetPage}&limit=${limit}` +
			(sort ? `&sort=${sort}` : "") +
			(query ? `&query=${query}` : "");

		res.json({
			status: "success",
			payload: products.docs,
			totalPages: products.totalPages,
			prevPage: products.prevPage || null,
			nextPage: products.nextPage || null,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: products.hasPrevPage ? buildLink(products.prevPage) : null,
			nextLink: products.hasNextPage ? buildLink(products.nextPage) : null,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// GET /api/products/:pid
export const getProductById = async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await Product.findById(pid);

		if (!product) {
			return res
				.status(404)
				.json({ status: "error", message: "Producto no encontrado" });
		}

		res.status(200).json({ status: "success", payload: product });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// POST /api/products
export const createProduct = async (req, res) => {
	try {
		const {
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbnail,
		} = req.body;

		if (!title || !description || !code || !price || !stock || !category) {
			return res
				.status(400)
				.json({ status: "error", message: "Faltan campos obligatorios" });
		}

		const newProduct = await Product.create({
			title,
			description,
			code,
			price,
			status: status !== undefined ? status : true,
			stock,
			category,
			thumbnail: thumbnail || "",
		});

		res.status(201).json({
			status: "success",
			message: "Producto agregado",
			payload: newProduct,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// PUT /api/products/:pid
export const updateProduct = async (req, res) => {
	try {
		const { pid } = req.params;
		const updatedFields = req.body;

		if (updatedFields.id) {
			return res.status(400).json({
				status: "error",
				message: "No puedes modificar el ID del producto",
			});
		}

		const updatedProduct = await Product.findByIdAndUpdate(pid, updatedFields, {
			new: true,
		});

		if (!updatedProduct) {
			return res
				.status(404)
				.json({ status: "error", message: "Producto no encontrado" });
		}

		res.status(200).json({
			status: "success",
			message: "Producto actualizado",
			payload: updatedProduct,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// DELETE /api/products/:pid
export const deleteProduct = async (req, res) => {
	try {
		const { pid } = req.params;
		const deletedProduct = await Product.findByIdAndDelete(pid);

		if (!deletedProduct) {
			return res
				.status(404)
				.json({ status: "error", message: "Producto no encontrado" });
		}

		res.status(200).json({
			status: "success",
			message: `Producto con ID ${pid} eliminado.`,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Funciones auxiliares 
const getFilterOption = (query) => {
	if (!query) return {};
	if (query === "available") return { status: true };
	return { category: query };
};

const getSortOption = (sort) => {
	if (sort === "asc") return { price: 1 };
	if (sort === "desc") return { price: -1 };
	return {};
};
