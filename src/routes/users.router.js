import express from "express";
import passport from "passport";
import {
	registerSuccess,
	loginSuccess,
	failRegister,
	failLogin,
	getCurrentUser,
} from "../controllers/users.controller.js";
import { authToken } from "../middlewares/auth.js";

const usersRouter = express.Router();

usersRouter.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/api/users/fail-register",
	}),
	registerSuccess
);

usersRouter.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/api/users/fail-login",
		session: false, 
	}),
	loginSuccess
);

usersRouter.get("/fail-register", failRegister);
usersRouter.get("/fail-login", failLogin);

usersRouter.get("/current", authToken, getCurrentUser);

export default usersRouter;
