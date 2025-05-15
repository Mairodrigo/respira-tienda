import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Esquema del modelo de usuario
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
			match: [/\S+@\S+\.\S+/, "Formato de email inválido"],
		},
		age: {
			type: Number,
			required: true,
			min: [0, "La edad no puede ser negativa"],
		},
		password: {
			type: String,
			required: true,
			select: false, 
		},
		cart: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cart",
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

// Hash de contraseña antes de guardar
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
		this.password = hashedPassword;
		next();
	} catch (error) {
		next(error);
	}
});

// Método para comparar contraseñas
userSchema.methods.isValidPassword = async function (plainPassword) {
	return bcrypt.compare(plainPassword, this.password);
};

// Export del modelo, evitando redefinir en dev
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
