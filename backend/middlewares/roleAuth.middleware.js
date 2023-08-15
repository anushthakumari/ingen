const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports = (role = "editor") =>
	asyncHandler((req, res, next) => {
		if (!req.userData) {
			return next(
				new ErrorResponse(
					"You're Not Authorize To Access This Particular Route",
					401
				)
			);
		}

		if (req.userData.role !== role) {
			return next(
				new ErrorResponse(
					"You're Not Authorize To Access This Particular Route",
					401
				)
			);
		}
		next();
	});
