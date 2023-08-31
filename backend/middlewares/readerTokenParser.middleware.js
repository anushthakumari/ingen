const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../libs/jwt");

module.exports = asyncHandler(async (req, res, next) => {
	const token = req.session.token;

	try {
		if (token) {
			let decoded = verifyToken(token);
			req.userData = decoded;
		}
	} catch (error) {
	} finally {
		next();
	}
});
