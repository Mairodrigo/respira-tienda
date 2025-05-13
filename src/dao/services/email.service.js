import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER || "test@example.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "claveEmailFalsa";

const transporter = nodemailer.createTransport({
	service: "gmail", // O el que uses: Outlook, Mailtrap, etc.
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
});

/**
 * Envía un correo con el enlace para restablecer contraseña
 * @param {string} to - Dirección de email del usuario
 * @param {string} resetLink - Enlace para resetear contraseña
 */
export const sendResetPasswordEmail = async (to, resetLink) => {
	try {
		const mailOptions = {
			from: `"Soporte Ecommerce" <${EMAIL_USER}>`,
			to,
			subject: "Recuperación de contraseña",
			html: `
				<h2>Recuperación de Contraseña</h2>
				<p>Haz clic en el siguiente botón para restablecer tu contraseña. Este enlace expirará en 1 hora.</p>
				<a href="${resetLink}" style="
					display:inline-block;
					padding:10px 20px;
					background-color:#007bff;
					color:#fff;
					text-decoration:none;
					border-radius:5px;
					font-weight:bold;">
					Restablecer contraseña
				</a>
				<p>Si no solicitaste este correo, puedes ignorarlo.</p>
			`,
		};

		await transporter.sendMail(mailOptions);
		console.log("📧 Email de recuperación enviado a:", to);
	} catch (error) {
		console.error("❌ Error al enviar el email:", error.message);
		throw new Error("No se pudo enviar el correo de recuperación");
	}
};
