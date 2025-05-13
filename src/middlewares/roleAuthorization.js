export const roleAuthorization = (roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({
				status: "error",
				message: "No tienes permisos para acceder a esta ruta",
			});
		}
		next(); // Si el rol está permitido, continua con la siguiente función
	};
};
