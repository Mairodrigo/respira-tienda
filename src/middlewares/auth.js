import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware para verificar la validez del token JWT en rutas protegidas.
 */
export const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	// Verificar presencia y formato correcto del header
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			status: "error",
			message:
				"Token no enviado o formato incorrecto. Se espera 'Bearer <token>'",
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const decodedUser = verifyToken(token);
		console.log("🧪 Token decodificado:", decodedUser);

		// Validar el contenido del token
		if (!decodedUser || typeof decodedUser !== "object" || !decodedUser.email) {
			return res.status(403).json({
				status: "error",
				message: "Token inválido: contenido incorrecto",
			});
		}

		// Asignar usuario al objeto request
		req.user = decodedUser;

		// Pasar al siguiente middleware o controlador
		next();
	} catch (error) {
		console.error("Error al verificar token:", error.message);

		return res.status(403).json({
			status: "error",
			message: "Token inválido o expirado",
		});
	}
};

//Validar roles
export const authRole = (roles = []) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ message: "Acceso denegado por rol" });
		}
		next();
	};
};

