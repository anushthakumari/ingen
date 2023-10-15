const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports.generateToken = ({ id, email, role, name }) => {
	const privateKey = process.env.TOKEN_KEY;
	const expiresIn = parseInt(process.env.TOKEN_EXP_MSEC);
	return jwt.sign({ id, email, role, name }, privateKey, { expiresIn });
};

module.exports.verifyToken = (token) => {
	try {
		const privateKey = process.env.TOKEN_KEY;
		return jwt.verify(token, privateKey);
	} catch (err) {
		throw new ErrorResponse("Authorization failed!", 401);
	}
};
