// Librerías necesarias y enrutadores
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

// Instancia de la aplicación de Express
const app = express();
// Creacion del servidor de forma explicita
const server = http.createServer(app);
//Variable para manejar entrada y salida de websockets
const io = new Server(server);

//Configuracion handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Puerto en el que escuchará
const PORT = 8080;
// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());
//Habilitacion de la carpeta public
app.use(express.static("src/public"));

// Configuración de rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Websockets
const productManager = new ProductManager("./src/data/products.json");
io.on("connection", (socket) => {
	console.log("Cliente conectado");

	socket.on("newProduct", async (productData) => {
		try {
			const newProduct = await productManager.addProduct(productData);

			io.emit("productAdded", newProduct);
		} catch (error) {
			console.error(
				"Error al añadir el producto. Verifique y vuelva a intentarlo",
				error.message
			);
		}
	});
});

//Manejo de rutas no encontradas
app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

//Se levanta el servidor
server.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
