import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";
import { isValidPassword } from "../utils/hash.js";

// Registro con passport (función post-authenticación)
export const registerSuccess = (req, res) => {
	res.status(201).json({
		status: "success",
		message: "Usuario registrado con éxito",
		payload: req.user,
	});
};

// Login con validación manual y JWT
export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || !isValidPassword(password, user.password)) {
			return res.status(401).json({
				status: "error",
				message: "Credenciales inválidas",
			});
		}

		const userPayload = {
			_id: user._id,
			email: user.email,
			role: user.role,
			first_name: user.first_name,
			last_name: user.last_name,
		};

		const token = generateToken(userPayload);

		res.status(200).json({
			status: "success",
			message: "Login exitoso",
			token,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Fallo de registro
export const failRegister = (req, res) => {
	res.status(400).json({
		status: "error",
		message: "Registro fallido: el usuario ya existe o hubo un error",
	});
};

// Fallo de login
export const failLogin = (req, res) => {
	res.status(401).json({
		status: "error",
		message: "Login fallido: usuario o contraseña incorrectos",
	});
};
