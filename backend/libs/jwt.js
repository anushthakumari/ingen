const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports.generateToken = ({ id, email, role, name }) => {
	const privateKey = process.env.TOKEN_KEY;
	return jwt.sign({ id, email, role, name }, privateKey, { expiresIn: "6h" });
};

module.exports.verifyToken = (token) => {
	try {
		const privateKey = process.env.TOKEN_KEY;
		return jwt.verify(token, privateKey);
	} catch (err) {
		throw new ErrorResponse("Authorization failed!", 401);
	}
};
