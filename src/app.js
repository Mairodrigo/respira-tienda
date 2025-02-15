// Librerías necesarias y enrutadores
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

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
app.use(express.static("public"));

// Configuración de rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Manejo de rutas no encontradas
app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

//Websockets
io.on("connection", (socket) => {
	console.log("Ingresó un nuevo usuario");
});

//Se levanta el servidor
server.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
