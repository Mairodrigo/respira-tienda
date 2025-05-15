import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Encripta una contraseña en texto plano usando bcrypt.
 * @param {string} plainPassword - Contraseña sin encriptar
 * @returns {Promise<string>} - Contraseña hasheada
 */
export const createHash = async (plainPassword) => {
	return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compara una contraseña en texto plano con un hash.
 * @param {string} plainPassword - Contraseña que ingresa el usuario
 * @param {string} hashedPassword - Hash guardado en la base de datos
 * @returns {Promise<boolean>} - true si coinciden
 */
export const isValidPassword = async (plainPassword, hashedPassword) => {
	if (!plainPassword || !hashedPassword) return false;
	return await bcrypt.compare(plainPassword, hashedPassword);
};
