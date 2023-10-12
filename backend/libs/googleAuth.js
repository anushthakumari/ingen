const { OAuth2Client } = require("google-auth-library");

module.exports.client = new OAuth2Client();

module.exports.verify = async (token = "") => {
	const ticket = await this.client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_AUTH_CLIENT_ID,
	});

	const payload = ticket.getPayload();

	return payload;
};
