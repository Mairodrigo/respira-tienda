import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definición del esquema del modelo de usuario
const userSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
			trim: true,
		},
		last_name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		age: {
			type: Number,
			required: true,
			min: 0,
		},
		password: {
			type: String,
			required: true,
		},
		cart: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cart", // Referencia al modelo de carrito
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

// Middleware que encripta la contraseña antes de guardar
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // Evita rehashear si no fue modificada

	try {
		this.password = await bcrypt.hash(this.password, 10); // Encripta
		next(); // Continúa el guardado
	} catch (error) {
		next(error); // Pasa error a Express si falla
	}
});

// Método de instancia para comparar contraseñas
userSchema.methods.isValidPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

// Evita redefinir el modelo si ya fue declarado (útil en dev o testing)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
