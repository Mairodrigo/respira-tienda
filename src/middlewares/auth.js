import { verifyToken } from "../utils/jwt.js";

// Middleware para verificar que el usuario tenga un token válido
export const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	// Validar que exista la cabecera Authorization
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			status: "error",
			message: "Token no enviado o formato incorrecto",
		});
	}

	// Extraer el token del encabezado
	const token = authHeader.split(" ")[1];

	try {
		// Verificar la validez del token
		const decodedUser = verifyToken(token);

		// Si no hay payload válido, se rechaza
		if (!decodedUser || typeof decodedUser !== "object") {
			return res.status(403).json({
				status: "error",
				message: "Token inválido",
			});
		}

		// Agregar el usuario al request para usar en la ruta protegida
		req.user = decodedUser;

		// Continuar con la ejecución del endpoint
		next();
	} catch (error) {
		console.error("❌ Error al verificar token:", error.message);
		return res.status(403).json({
			status: "error",
			message: "Token inválido o expirado",
		});
	}
};
