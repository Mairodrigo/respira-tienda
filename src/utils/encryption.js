import bcrypt from "bcrypt";

// Encriptar contraseña
export const hashPassword = (plainPassword) => {
	const saltRounds = 10;
	return bcrypt.hashSync(plainPassword, saltRounds);
};

// Verificar contraseña
export const comparePassword = (plainPassword, hashedPassword) => {
	return bcrypt.compareSync(plainPassword, hashedPassword);
};
