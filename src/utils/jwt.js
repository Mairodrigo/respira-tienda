import jwt from "jsonwebtoken";

// Se recomienda usar una variable de entorno para el secreto
const JWT_SECRET = process.env.JWT_SECRET || "claveUltraSecreta123";

/**
 * Genera un token JWT con los datos necesarios del usuario.
 * No se deben incluir contraseñas ni datos sensibles.
 */
export const generateToken = (user) => {
	const payload = {
		_id: user._id,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		role: user.role || "user",
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1h", // Tiempo de expiración configurable
	});
};

/**
 * Verifica un token JWT y devuelve su contenido si es válido.
 * Lanza un error si el token es inválido o expiró.
 */
export const verifyToken = (token) => {
	return jwt.verify(token, JWT_SECRET);
};
