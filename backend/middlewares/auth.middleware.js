const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const { verifyToken } = require("../libs/jwt");

const allowed_roles = ["editor", "admin"];

module.exports = asyncHandler((req, res, next) => {
	const token = req.session.token;
	if (!token) {
		return next(
			new ErrorResponse(
				"You're Not Authorize To Access This Particular Route",
				401
			)
		);
	}
	let decoded = verifyToken(token);

	if (!allowed_roles.includes(decoded.role)) {
		return next(
			new ErrorResponse(
				"You're Not Authorize To Access This Particular Route",
				401
			)
		);
	}

	req.userData = decoded;
	next();
});
