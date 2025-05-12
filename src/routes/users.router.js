// src/routes/users.router.js
import express from "express";
import passport from "passport";
import {
	registerSuccess,
	loginUser,
	failRegister,
	failLogin,
} from "../controllers/users.controller.js";

const usersRouter = express.Router();

usersRouter.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/api/users/fail-register",
	}),
	registerSuccess
);

usersRouter.post("/login", loginUser);

usersRouter.get("/fail-register", failRegister);

usersRouter.get("/fail-login", failLogin);

export default usersRouter;
