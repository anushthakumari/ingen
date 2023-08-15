const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const { verifyToken } = require("../libs/jwt");

module.exports = asyncHandler((req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) {
		return next(
			new ErrorResponse(
				"You're Not Authorize To Access This Particular Route",
				401
			)
		);
	}

	let decoded = verifyToken(token);
	req.userData = decoded;
	next();
});
