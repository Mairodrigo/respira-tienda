// Librerías necesarias
import express from "express"; // Framework para crear el servidor

//Importacion de enrutadores
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js'; 

// Instancia de la aplicación de Express
const app = express();

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Puerto en el que escuchará
const PORT = 8080;

// Configuración de rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 

//Manejo de rutas no encontradas
app.use((req, res) => {
res.status(404).json({ error: 'Ruta no encontrada' });
});

//Se levanta el servidor
app.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});