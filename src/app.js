import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB Atlas
const mongoURI = process.env.MONGO_URI; // Obtener la URI desde el .env

const connectMongoDB = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log("Conectado a MongoDB");
	} catch (error) {
		console.error("Error en la conexión a MongoDB:", error.message);
		process.exit(1); // Cierra la app si falla la conexión
	}
};
connectMongoDB();

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.static("src/public"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// WebSockets
const productManager = new ProductManager();

io.on("connection", (socket) => {
	console.log("Cliente conectado");

	// Escucha para agregar un producto vía WebSocket
	socket.on("newProduct", async (productData) => {
		try {
			await productManager.addProduct(productData);
			const products = await productManager.getProducts();
			io.emit("updateProducts", products);
		} catch (error) {
			console.error("Error al añadir el producto:", error.message);
		}
	});

	// Escucha para eliminar un producto vía WebSocket
	socket.on("deleteProduct", async (id) => {
		try {
			await productManager.deleteProductById(id);
			const products = await productManager.getProducts();
			io.emit("updateProducts", products);
		} catch (error) {
			console.error("Error al eliminar el producto:", error.message);
		}
	});

	socket.on("disconnect", () => {
		console.log("Cliente desconectado");
	});
});

// Middleware para rutas no encontradas
app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

// Levantar el servidor
server.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
