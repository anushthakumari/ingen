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

exports.register = asyncHandler(async (req, res, next) => {
	const { email, pass, name } = req.body;
	const role = "editor";

	const { rowCount } = await pool.query({
		text: `SELECT * FROM users where email=$1`,
		values: [email],
	});

	if (rowCount) {
		res.status(400).send({
			message: "User with this email already exists!",
		});
		return;
	}

	const { rows: inRows } = await pool.query({
		text: `INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id`,
		values: [name, email, pass, role],
	});

	const token = generateToken({
		id: inRows[0].id,
		email,
		role,
	});

	res.send({
		message: "Login successfull",
		token,
		role,
	});
});
