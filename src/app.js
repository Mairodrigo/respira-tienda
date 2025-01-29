// Librerías necesarias
import express from "express"; // Framework para crear el servidor

// Instancia de la aplicación de Express
const app = express();

//Rutas
app.get("/", (req, res) => {
	res.send ("Bienvenido")
});

// Middleware para procesar datos JSON en las solicitudes
app.use(express.json());

// Puerto en el que escuchará
const PORT = 8080;

//Se levanta el servidor
app.listen(PORT, () => {
	console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
