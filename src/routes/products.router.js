import express from "express";
import Product from "../models/Product.model.js";

const productsRouter = express.Router();

// ✅ GET /api/products - Obtener productos con filtros, paginación y ordenamiento
productsRouter.get("/", async (req, res) => {
	try {
		const { limit = 10, page = 1, sort, query } = req.query;

		// 📌 Filtros dinámicos
		const filter = {};
		if (query) {
			if (query === "available") filter.status = true;
			else filter.category = query;
		}

		// 📌 Opciones de paginación
		const options = {
			page: parseInt(page),
			limit: parseInt(limit),
			sort:
				sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
		};

		// 📌 Obtener productos con paginación
		const products = await Product.paginate(filter, options);

		res.json({
			status: "success",
			payload: products.docs,
			totalPages: products.totalPages,
			prevPage: products.prevPage || null,
			nextPage: products.nextPage || null,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: products.hasPrevPage
				? `/api/products?page=${products.prevPage}&limit=${limit}${
						sort ? `&sort=${sort}` : ""
				  }${query ? `&query=${query}` : ""}`
				: null,
			nextLink: products.hasNextPage
				? `/api/products?page=${products.nextPage}&limit=${limit}${
						sort ? `&sort=${sort}` : ""
				  }${query ? `&query=${query}` : ""}`
				: null,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// ✅ GET /api/products/:pid - Obtener un producto por su ID
productsRouter.get("/:pid", async (req, res) => {
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
});

// ✅ POST /api/products - Agregar un nuevo producto
productsRouter.post("/", async (req, res) => {
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

		// Validación de campos obligatorios
		if (!title || !description || !code || !price || !stock || !category) {
			return res
				.status(400)
				.json({ status: "error", message: "Faltan campos obligatorios" });
		}

		// Crear el nuevo producto
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
});

// ✅ PUT /api/products/:pid - Modificar un producto por su ID
productsRouter.put("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const updatedFields = req.body;

		// Evitar que se modifique el ID
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
});

// ✅ DELETE /api/products/:pid - Eliminar un producto por su ID
productsRouter.delete("/:pid", async (req, res) => {
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
});

// Exporta el router
export default productsRouter;
