import express from "express";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";

const router = express.Router();

// ✅ GET / - Mostrar home con paginación de productos
router.get("/", async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const options = {
			page: parseInt(page),
			limit: parseInt(limit),
			lean: true,
		};

		const products = await Product.paginate({}, options);

		res.render("home", {
			products: products.docs,
			totalPages: products.totalPages,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: products.hasPrevPage
				? `/products?page=${products.prevPage}&limit=${limit}`
				: null,
			nextLink: products.hasNextPage
				? `/products?page=${products.nextPage}&limit=${limit}`
				: null,
		});
	} catch (error) {
		res.status(500).send("Error al cargar los productos");
	}
});

// ✅ GET /products/:pid - Mostrar detalles de un producto
router.get("/products/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await Product.findById(pid).lean();

		if (!product) {
			return res.status(404).send("Producto no encontrado");
		}

		res.render("productDetail", { product });
	} catch (error) {
		res.status(500).send("Error al cargar el producto");
	}
});

// ✅ GET /carts/:cid - Mostrar productos de un carrito
router.get("/carts/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await Cart.findById(cid).populate("products.productId").lean();

		if (!cart) {
			return res.status(404).send("Carrito no encontrado");
		}

		res.render("cartDetail", { cart });
	} catch (error) {
		res.status(500).send("Error al cargar el carrito");
	}
});

export default router;
