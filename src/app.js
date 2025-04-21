import express from "express";
import http from "http";
import connectMongoDB from "./config/mongoose.config.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import ProductManager from "./managers/ProductManager.js";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

// Conexión a Mongo
connectMongoDB();

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

// Session y Passport deben ir antes de las rutas
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

// WebSockets
const productManager = new ProductManager();

io.on("connection", (socket) => {
	console.log("Cliente conectado");

	socket.on("newProduct", async (productData) => {
		try {
			await productManager.addProduct(productData);
			const products = await productManager.getProducts();
			io.emit("updateProducts", products);
		} catch (error) {
			console.error("Error al añadir el producto:", error.message);
		}
	});

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

// Middleware para rutas no encontradas (si nada de lo anterior hizo match)
app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

// Levantar el servidor
server.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
