import express from "express";
import { authToken } from "../middlewares/auth.js"; // Middleware que valida el JWT
import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt"; // Para encriptar contraseñas
import jwt from "jsonwebtoken"; // Para generar tokens JWT

const sessionsRouter = express.Router();

// Registrar un nuevo usuario
sessionsRouter.post("/register", async (req, res) => {
	const { first_name, last_name, email, age, password } = req.body;

	try {
		// Buscar si ya existe un usuario con ese email
		const exist = await UserModel.findOne({ email });
		if (exist)
			return res.status(400).json({
				status: "error",
				message: "Usuario ya registrado",
			});

		// Encriptar la contraseña antes de guardarla
		const hashedPassword = bcrypt.hashSync(password, 10);

		// Crear el nuevo usuario con la contraseña encriptada
		const newUser = await UserModel.create({
			first_name,
			last_name,
			email,
			age,
			password: hashedPassword,
		});

		// Se creo con exito
		res.status(201).json({
			status: "success",
			message: "Usuario registrado",
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Error en el servidor",
		});
	}
});

// Login del usuario y generación de JWT
sessionsRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Buscar usuario por email
		const user = await UserModel.findOne({ email });
		if (!user)
			return res.status(400).json({
				status: "error",
				message: "Credenciales inválidas",
			});

		// Verificar contraseña ingresada vs almacenada
		const isValidPassword = bcrypt.compareSync(password, user.password);
		if (!isValidPassword)
			return res.status(400).json({
				status: "error",
				message: "Credenciales inválidas",
			});

		// Crear el token con los datos necesarios
		const token = jwt.sign(
			{
				_id: user._id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				role: user.role,
			},
			process.env.JWT_SECRET || "jwtSecret",
			{ expiresIn: "1h" } // Expira en 1 hora
		);

		res.json({ status: "success", token });
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Error en el servidor",
		});
	}
});

// Obtener datos del usuario actual mediante el token
sessionsRouter.get("/current", authToken, (req, res) => {
	// authToken ya verificó y agregó el usuario al req
	res.json({
		status: "success",
		message: "Usuario autenticado",
		payload: req.user,
	});
});

export default sessionsRouter;
