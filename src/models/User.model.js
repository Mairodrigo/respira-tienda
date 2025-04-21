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
			ref: "Cart", // nombre del modelo de carrito
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

// Encriptar la contraseña antes de guardarla
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		this.password = await bcrypt.hash(this.password, 10);
		next();
	} catch (error) {
		next(error);
	}
});

// Métodos para comparar contraseñas
userSchema.methods.isValidPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

// Verifica si el modelo ya está definido
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;