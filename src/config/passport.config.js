import passport from "passport";
import local from "passport-local";
import User from "../models/User.model.js";
import { createHash, isValidPassword } from "../utils/encryption.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
	// Estrategia de registro
	passport.use(
		"register",
		new LocalStrategy(
			{ usernameField: "email", passReqToCallback: true },
			async (req, email, password, done) => {
				try {
					const { first_name, last_name, age } = req.body;

					const existingUser = await User.findOne({ email });
					if (existingUser) {
						return done(null, false, { message: "El usuario ya existe" });
					}

					const hashedPassword = await createHash(password);

					const newUser = await User.create({
						first_name,
						last_name,
						email,
						age,
						password: hashedPassword,
					});

					return done(null, newUser);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	// Estrategia de login
	passport.use(
		"login",
		new LocalStrategy(
			{ usernameField: "email", passReqToCallback: true },
			async (req, email, password, done) => {
				try {
					const user = await User.findOne({ email }).select("+password");

					
					if (!user) {
						return done(null, false, { message: "Usuario no encontrado" });
					}

					const isPasswordValid = await isValidPassword(
						password,
						user.password
					);


					if (!isPasswordValid) {
						return done(null, false, { message: "Contraseña incorrecta" });
					}

					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
	

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};

export default initializePassport;
