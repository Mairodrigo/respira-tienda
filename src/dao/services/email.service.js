import nodemailer from "nodemailer";

let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: testAccount.user,
		pass: testAccount.pass,
	},
});

export const sendResetPasswordEmail = async (to, resetLink) => {
	try {
		const mailOptions = {
			from: `"Soporte Ecommerce" <${testAccount.user}>`,
			to,
			subject: "Recuperación de contraseña",
			html: `
				<h2>Recuperación de Contraseña</h2>
				<p>Haz clic en el botón para restablecer tu contraseña.</p>
				<a href="${resetLink}">Restablecer</a>
			`,
		};

		const info = await transporter.sendMail(mailOptions);

		console.log("📨 Email enviado: %s", info.messageId);
		console.log("🔍 Vista previa: %s", nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.error("❌ Error al enviar el email:", error.message);
		throw new Error("No se pudo enviar el correo de recuperación");
	}
};
