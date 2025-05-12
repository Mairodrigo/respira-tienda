import bcrypt from "bcrypt";

// Encriptar contraseña
export const createHash = (plainPassword) => {
	const saltRounds = 10;
	return bcrypt.hashSync(plainPassword, saltRounds);
};

// Verificar contraseña
export const isValidPassword = (plainPassword, hashedPassword) => {
	return bcrypt.compareSync(plainPassword, hashedPassword);
};
