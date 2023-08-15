const asyncHandler = require("../utils/asyncHandler");
const pool = require("../libs/pool");
const { generateToken } = require("../libs/jwt");

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	const { rows, rowCount } = await pool.query({
		text: `SELECT * FROM users where email=$1`,
		values: [email],
	});

	if (!rowCount) {
		res.status(401).send({ message: "Invalid credentials" });
		return;
	}

	if (rows[0].password !== password) {
		res.status(401).send({ message: "Invalid credentials" });
		return;
	}

	const token = generateToken({
		id: rows[0].id,
		email: rows[0].email,
		role: rows[0].role,
	});

	res.send({
		message: "Login successfull",
		token,
		role: rows[0].role,
	});
});
