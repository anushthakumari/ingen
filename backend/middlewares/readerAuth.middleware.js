const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = asyncHandler((req, res, next) => {
	if (!req.userData) {
		return next(
			new ErrorResponse(
				"You're Not Authorized To Access This Particular Route",
				401
			)
		);
	}

	next();
});
