import User from "../models/User.model.js";
import { generateResetToken } from "../utils/resetJwt.js";
import { sendResetPasswordEmail } from "../services/email.service.js";
import { verifyResetToken } from "../utils/resetJwt.js";
import { createHash, isValidPassword } from "../utils/hash.js";


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // o donde tengas tu frontend

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res
				.status(400)
				.json({ status: "error", message: "El email es obligatorio" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			// No revelar que el usuario no existe (por seguridad)
			return res.status(200).json({
				status: "success",
				message:
					"Si el email está registrado, recibirás un enlace de recuperación",
			});
		}

		// Generar token que expira en 1 hora
		const resetToken = generateResetToken({ email: user.email });

		// Crear link con token
		const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

		// Enviar email
		await sendResetPasswordEmail(user.email, resetLink);

		return res.status(200).json({
			status: "success",
			message:
				"Si el email está registrado, recibirás un enlace de recuperación",
		});
	} catch (error) {
		console.error("Error en forgotPassword:", error.message);
		res
			.status(500)
			.json({
				status: "error",
				message: "Error al enviar el email de recuperación",
			});
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		if (!token || !newPassword) {
			return res
				.status(400)
				.json({ status: "error", message: "Faltan campos requeridos" });
		}

		// Verificar token
		let decoded;
		try {
			decoded = verifyResetToken(token);
		} catch (err) {
			return res
				.status(401)
				.json({ status: "error", message: "Token inválido o expirado" });
		}

		const user = await User.findOne({ email: decoded.email });
		if (!user) {
			return res
				.status(404)
				.json({ status: "error", message: "Usuario no encontrado" });
		}

		// Evitar reutilización de contraseña
		const samePassword = await isValidPassword(newPassword, user.password);
		if (samePassword) {
			return res
				.status(400)
				.json({
					status: "error",
					message: "No puedes usar la misma contraseña anterior",
				});
		}

		// Encriptar y guardar
		user.password = createHash(newPassword);
		await user.save();

		res.status(200).json({
			status: "success",
			message: "Contraseña restablecida correctamente",
		});
	} catch (error) {
		console.error("Error en resetPassword:", error.message);
		res
			.status(500)
			.json({ status: "error", message: "Error al restablecer la contraseña" });
	}
};
