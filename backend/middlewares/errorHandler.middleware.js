const ErrorResponse = require("../utils/ErrorResponse");
const { isCelebrateError } = require("celebrate");

module.exports = (err, req, res, next) => {
	console.log(err);
	let error = { ...err };
	error.message = err.message;

	//if validation error
	if (isCelebrateError(err)) {
		if (err.details.get("body")) {
			error = new ErrorResponse(
				err.details.get("body").details[0].message,
				400
			);
		} else {
			error = new ErrorResponse(
				err.details.get("params").details[0].message,
				400
			);
		}
	}

	error.statusCode = error.statusCode || 500;

	if (process.env.NODE_ENV === "development") {
		// console.log(err);
		return res.status(error.statusCode).send({
			success: false,
			message: error.message || "Server Error",
		});
	}

	if (error.statusCode !== 500) {
		res.status(error.statusCode).send({
			success: false,
			message: error.message,
		});
	} else {
		res.status(error.statusCode).send({
			success: false,
			message: "Server Error",
		});
	}
};
