import User from "../models/User.model.js";
import { generateResetToken, verifyResetToken } from "../utils/jwt.js";
import { sendResetPasswordEmail } from "../dao/services/email.service.js";
import { createHash, isValidPassword } from "../utils/encryption.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * POST /api/auth/request-reset
 * Recibe un email y envía un enlace de recuperación si existe el usuario.
 */
export const requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res
				.status(400)
				.json({ status: "error", message: "El email es obligatorio" });
		}

		const user = await User.findOne({ email });
		// Para evitar enumeración de correos, siempre devolvemos éxito
		if (!user) {
			return res.status(200).json({
				status: "success",
				message:
					"Si el email está registrado, recibirás un enlace de recuperación",
			});
		}

		// Generar token de recuperación con expiración de 1 hora
		const resetToken = generateResetToken(
			{ _id: user._id, email: user.email },
			"1h"
		);

		// Construir link para el frontend
		const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

		// Enviar correo
		await sendResetPasswordEmail(user.email, resetLink);

		return res.status(200).json({
			status: "success",
			message:
				"Si el email está registrado, recibirás un enlace de recuperación",
		});
	} catch (error) {
		console.error("Error en requestPasswordReset:", error);
		return res
			.status(500)
			.json({
				status: "error",
				message: "Error al enviar el correo de recuperación",
			});
	}
};

/**
 * POST /api/auth/reset-password
 * Recibe token y nueva contraseña, la valida y la actualiza si es diferente.
 */
export const resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;
		if (!token || !newPassword) {
			return res
				.status(400)
				.json({ status: "error", message: "Faltan campos requeridos" });
		}

		// Verificar y decodificar el token
		let payload;
		try {
			payload = verifyResetToken(token);
		} catch (err) {
			return res
				.status(400)
				.json({ status: "error", message: "Token inválido o expirado" });
		}

		const user = await User.findById(payload._id).select("+password");
		if (!user) {
			return res
				.status(404)
				.json({ status: "error", message: "Usuario no encontrado" });
		}

		// Evitar reutilización de la misma contraseña
		const same = await isValidPassword(newPassword, user.password);
		if (same) {
			return res.status(400).json({
				status: "error",
				message: "La nueva contraseña no puede ser igual a la anterior",
			});
		}

		// Hash de la nueva contraseña y guardado
		user.password = await createHash(newPassword);
		await user.save();

		return res.status(200).json({
			status: "success",
			message: "Contraseña restablecida correctamente",
		});
	} catch (error) {
		console.error("Error en resetPassword:", error);
		return res
			.status(500)
			.json({ status: "error", message: "Error al restablecer la contraseña" });
	}
};

/**
 * GET /reset-password
 * Muestra un formulario para ingresar la nueva contraseña.
 */
export const renderResetForm = (req, res) => {
    const { token } = req.query;
    if (!token) {
    return res.status(400).send("Token es obligatorio");
    }
    // Renderizamos la vista y pasamos el token oculto al formulario
    res.render("resetPassword", { token });
};