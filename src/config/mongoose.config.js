import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables del .env

const mongoURI = process.env.MONGO_URI; // Obtener la URI desde el .env

const connectMongoDB = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log("Conectado a Mongo");
	} catch (error) {
		console.error("Error en la conexión con MongoDB:", error.message);
		process.exit(1); // Cierra la app si falla la conexión
	}
};

export default connectMongoDB;
