import jwt from "jsonwebtoken";

const RESET_SECRET = process.env.JWT_RESET_SECRET || "superClaveDeReset123";

/**
 * Genera un token JWT para recuperación de contraseña
 * @param {Object} user - El usuario (debe tener _id y email)
 */
export const generateResetToken = (user) => {
	const payload = {
		_id: user._id,
		email: user.email,
	};

	return jwt.sign(payload, RESET_SECRET, {
		expiresIn: "1h", // 1 hora de expiración
	});
};

/**
 * Verifica el token de recuperación
 * @param {string} token
 * @returns {object} payload decodificado
 * @throws Error si el token es inválido o expiró
 */
export const verifyResetToken = (token) => {
	return jwt.verify(token, RESET_SECRET);
};
