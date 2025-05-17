import { generateToken } from "../utils/jwt.js";
import UserService from "../dao/services/user.service.js";
import UserDTO from "../dto/User.dto.js";

// Registro con Passport
export const registerSuccess = (req, res) => {
	const { first_name, last_name, email, role, _id } = req.user;
	const token = generateToken({ _id, email, role, first_name, last_name });

	res.status(201).json({
		status: "success",
		message: "Usuario registrado con éxito",
		token,
	});
};

// Login con Passport
export const loginSuccess = (req, res) => {
	const { first_name, last_name, email, role, _id } = req.user;
	const token = generateToken({_id, email, role, first_name, last_name });

	res.status(200).json({
		status: "success",
		message: "Login exitoso",
		token,
	});
};

// Endpoint protegido que usa DTO
export const getCurrentUser = async (req, res) => {
	try {
		const user = await UserService.getById(req.user._id);
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "Usuario no encontrado",
			});
		}

		const safeUser = new UserDTO(user);

		res.status(200).json({
			status: "success",
			user: safeUser,
		});
	} catch (error) {
		console.error("Error en /current:", error);
		res.status(500).json({
			status: "error",
			message: "Error interno del servidor",
		});
	}
};

// Fallos
export const failRegister = (req, res) => {
	res.status(400).json({
		status: "error",
		message: "Registro fallido: el usuario ya existe o hubo un error",
	});
};

export const failLogin = (req, res) => {
	res.status(401).json({
		status: "error",
		message: "Login fallido: usuario o contraseña incorrectos",
	});
};