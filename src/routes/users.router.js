import express from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.model.js";
import { isValidPassword } from "../utils/hash.js";

const usersRouter = express.Router();

// Registro de nuevo usuario
usersRouter.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/api/users/fail-register",
	}),
	(req, res) => {
		// Si la estrategia 'register' tuvo éxito, Passport carga el user en req.user
		res.status(201).json({
			status: "success",
			message: "Usuario registrado con éxito",
			payload: req.user,
		});
	}
);

// Login con JWT
usersRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Buscar al usuario en la base de datos
		const user = await User.findOne({ email });

		// Verificar si el usuario existe y si la contraseña es válida
		if (!user || !isValidPassword(password, user.password)) {
			return res.status(401).json({
				status: "error",
				message: "Credenciales inválidas",
			});
		}

		// Crear un objeto con los datos a incluir en el JWT
		const userPayload = {
			_id: user._id,
			email: user.email,
			role: user.role,
			first_name: user.first_name,
			last_name: user.last_name,
		};

		// Generar token
		const token = generateToken(userPayload);

		// Enviar token al cliente
		res.status(200).json({
			status: "success",
			message: "Login exitoso",
			token,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// ❗ Logout tradicional
/* usersRouter.get("/logout", (req, res) => {
	req.logout((error) => {
		if (error) {
			return res
				.status(500)
				.json({ status: "error", message: "Error al cerrar sesión" });
		}
		res.status(200).json({
			status: "success",
			message: "Sesión cerrada con éxito",
		});
	});
}); */

// Redirección si falla el registro
usersRouter.get("/fail-register", (req, res) => {
	res.status(400).json({
		status: "error",
		message: "Registro fallido: el usuario ya existe o hubo un error",
	});
});

// Redirección si falla el login
usersRouter.get("/fail-login", (req, res) => {
	res.status(401).json({
		status: "error",
		message: "Login fallido: usuario o contraseña incorrectos",
	});
});

export default usersRouter;
