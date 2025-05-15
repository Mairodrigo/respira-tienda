// --------------------
// 1. IMPORTS EXTERNOS
// --------------------
import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import session from "express-session";
import passport from "passport";
import { engine } from "express-handlebars";
import path from "path";

// --------------------
// 2. IMPORTS INTERNOS
// --------------------
import connectMongoDB from "./config/mongoose.config.js";
import initializePassport from "./config/passport.config.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js"; // ✅ nueva importación
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";
import setupSocket from "./sockets/products.socket.js";
import passwordRouter from "./routes/password.router.js";
import ordersRouter from "./routes/orders.router.js";
import purchaseRouter from "./routes/purchase.router.js";


// --------------------
// 3. CONFIGURACIÓN INICIAL
// --------------------
dotenv.config();

if (!process.env.SESSION_SECRET) {
	throw new Error("Falta definir SESSION_SECRET en el archivo .env");
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

// --------------------
// 4. CONEXIÓN A MONGO
// --------------------
connectMongoDB();

// --------------------
// 5. CONFIGURACIÓN HANDLEBARS
// --------------------
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src", "views"));

// --------------------
// 6. MIDDLEWARES GENERALES
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("src", "public")));

// --------------------
// 7. SESSION + PASSPORT
// --------------------
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

// --------------------
// 8. RUTAS
// --------------------
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", passwordRouter);
app.use("/api/orders", ordersRouter);
app.use("/", passwordRouter); 
app.use("/", viewsRouter);

// --------------------
// 9. WEBSOCKETS
// --------------------
const productManager = new ProductManager();
setupSocket(io, productManager);

// --------------------
// 10. 404 HANDLER
// --------------------
app.use((req, res) => {
	if (req.accepts("html")) {
		return res.status(404).render("404", { url: req.originalUrl });
	}
	res.status(404).json({ error: "Ruta no encontrada" });
});

// --------------------
// 11. LEVANTAR SERVIDOR
// --------------------
server.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
