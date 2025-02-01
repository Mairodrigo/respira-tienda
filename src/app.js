// Librerías necesarias y enrutadores
import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Instancia de la aplicación de Express
const app = express();
// Puerto en el que escuchará
const PORT = 8080;
// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

//Configuración de mensaje de bienvenida
app.get("/", (req, res) => {
	res.send(`
    <h1>Bienvenido a Respira 🌿</h1>
    <p>Proyecto de tienda de productos energéticos.</p>
    <h2>📌 Rutas disponibles:</h2>
    <ul>
    <li><strong>Productos:</strong></li>
    <ul>
        <li>📍 <strong>GET</strong> <a href="/api/products">/api/products</a> → Obtener todos los productos</li>
        <li>📍 <strong>GET</strong> /api/products/:pid → Obtener un producto por ID</li>
        <li>📍 <strong>POST</strong> /api/products → Agregar un nuevo producto</li>
        <li>📍 <strong>PUT</strong> /api/products/:pid → Modificar un producto</li>
        <li>📍 <strong>DELETE</strong> /api/products/:pid → Eliminar un producto</li>
    </ul>
    <li><strong>Carritos:</strong></li>
    <ul>
        <li>📍 <strong>POST</strong> <a href="/api/carts">/api/carts</a> → Crear un nuevo carrito</li>
        <li>📍 <strong>GET</strong> /api/carts/:cid → Obtener un carrito por ID</li>
        <li>📍 <strong>POST</strong> /api/carts/:cid/products/:pid → Agregar un producto a un carrito</li>
    </ul>
    </ul>
    <p>Prueba estas rutas en Postman o directamente en el navegador.</p>
`);
});

// Configuración de rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Manejo de rutas no encontradas
app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

//Se levanta el servidor
app.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
