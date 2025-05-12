import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";

// Registro de usuario
export const registerUser = async (req, res) => {
	try {
		const { first_name, last_name, email, age, password } = req.body;

		if (!first_name || !last_name || !email || !age || !password) {
			return res.status(400).json({
				status: "error",
				message: "Todos los campos son obligatorios",
			});
		}

		const exists = await User.findOne({ email });
		if (exists) {
			return res.status(400).json({
				status: "error",
				message: "Ya existe un usuario con ese email",
			});
		}

		const newUser = new User({ first_name, last_name, email, age, password });
		await newUser.save();

		res.status(201).json({
			status: "success",
			message: "Usuario registrado correctamente",
		});
	} catch (error) {
		console.error("Error en /register:", error);
		res.status(500).json({
			status: "error",
			message: "Error interno del servidor",
		});
	}
};

// Login
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				status: "error",
				message: "Email y contraseña son obligatorios",
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				status: "error",
				message: "Usuario no encontrado",
			});
		}

		const isValid = await user.isValidPassword(password);
		if (!isValid) {
			return res.status(401).json({
				status: "error",
				message: "Contraseña incorrecta",
			});
		}

		const token = generateToken({
			id: user._id,
			email: user.email,
			role: user.role,
			first_name: user.first_name,
		});

		res.json({
			status: "success",
			message: "Login exitoso",
			token,
		});
	} catch (error) {
		console.error("Error en /login:", error);
		res.status(500).json({
			status: "error",
			message: "Error interno del servidor",
		});
	}
};

// Ruta protegida
export const getCurrentUser = (req, res) => {
	res.json({
		status: "success",
		message: "Ruta protegida accedida correctamente",
		user: req.user,
	});
};
