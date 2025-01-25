// Librerías necesarias
import express from "express"; // Framework para crear el servidor
import paths from "./utils/paths.js";
import productsRouter from "./routes/products.js"; // Rutas para /products
import cartsRouter from "./routes/carts.js"; // Rutas para /carts

// Instancia de la aplicación de Express
const app = express();

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Asociacion de rutas con sus endpoints
app.use("/products", productsRouter); // Todas las rutas bajo /products
app.use("/carts", cartsRouter); // Todas las rutas bajo /carts

// Puerto en el que escuchará
const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
