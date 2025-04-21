import { verifyToken } from "../utils/jwt.js";

export const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader)
		return res
			.status(401)
			.json({ status: "error", message: "Token no enviado" });

	const token = authHeader.split(" ")[1];

	try {
		const user = verifyToken(token);
		req.user = user;
		next();
	} catch (error) {
		res
			.status(403)
			.json({ status: "error", message: "Token inválido o expirado" });
	}
};
