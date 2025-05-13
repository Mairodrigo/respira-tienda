import jwt from "jsonwebtoken";

const JWT_RESET_SECRET =
	process.env.JWT_RESET_SECRET || "claveUltraSeguraSoloParaReset";

export const generateResetToken = (payload) => {
	return jwt.sign(payload, JWT_RESET_SECRET, { expiresIn: "1h" });
};

export const verifyResetToken = (token) => {
	return jwt.verify(token, JWT_RESET_SECRET);
};
