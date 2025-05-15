// src/utils/jwt.js

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "claveUltraSecreta123";
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "claveUltraReset123";

const DEFAULT_EXPIRATION = "1h";

/**
 * Genera un token JWT con los datos necesarios del usuario.
 * Usado para autenticación de sesión.
 * @param {Object} user - Datos del usuario
 * @param {string} [expiresIn] - Tiempo opcional de expiración
 * @returns {string} - Token JWT
 */
export const generateToken = (user, expiresIn = DEFAULT_EXPIRATION) => {
	const payload = {
		_id: user._id,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		role: user.role || "user",
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verifica y decodifica un token JWT de sesión.
 * @param {string} token - JWT recibido
 * @returns {Object} - Payload decodificado si es válido
 * @throws {Error} - Si el token es inválido o expiró
 */
export const verifyToken = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (err) {
		throw new Error("Token inválido o expirado");
	}
};

/**
 * Genera un token JWT para recuperación de contraseña.
 * Expira por defecto en 1 hora.
 * @param {Object} payload - Datos mínimos (e.g. { _id, email })
 * @param {string} [expiresIn] - Tiempo opcional de expiración
 * @returns {string} - Token JWT para reset
 */
export const generateResetToken = (payload, expiresIn = DEFAULT_EXPIRATION) => {
	return jwt.sign(payload, JWT_RESET_SECRET, { expiresIn });
};

/**
 * Verifica y decodifica un token JWT de recuperación de contraseña.
 * @param {string} token - JWT recibido
 * @returns {Object} - Payload decodificado si es válido
 * @throws {Error} - Si el token es inválido o expiró
 */
export const verifyResetToken = (token) => {
	try {
		return jwt.verify(token, JWT_RESET_SECRET);
	} catch (err) {
		throw new Error("Token de recuperación inválido o expirado");
	}
};
