module.exports = (err, req, res, next) => {
	console.log(err);
	let error = { ...err };
	error.message = err.message;

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
