import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "claveUltraSecreta123"; // usá un .env

// Firmar token
export const generateToken = (user) => {
	return jwt.sign(user, JWT_SECRET, {
		expiresIn: "1h", // o "7d", según prefieras
	});
};

// Verificar token
export const verifyToken = (token) => {
	return jwt.verify(token, JWT_SECRET);
};
