const bcrypt = require("bcrypt");

const asyncHandler = require("../utils/asyncHandler");
const pool = require("../libs/pool");
const { generateToken } = require("../libs/jwt");

const TABLE_NAME = "readers";

const saltRounds = 10;

exports.login = asyncHandler(async (req, res, next) => {
	if (req.method === "POST") {
		if (req.session.token) {
			res.status(200).send({
				message: "Already Logged in!",
			});
			return;
		}

		const { email, password } = req.body;

		const { rows, rowCount } = await pool.query({
			text: `SELECT * FROM ${TABLE_NAME} where email=$1`,
			values: [email],
		});

		if (!rowCount) {
			res.status(401).send({ message: "Invalid credentials" });
			return;
		}

		const hash = rows[0].pass;

		const isvalidpass = await bcrypt.compare(password, hash);

		if (!isvalidpass) {
			res.status(401).send({ message: "Invalid credentials" });
			return;
		}

		const token = generateToken({
			id: rows[0].id,
			email: rows[0].email,
			name: rows[0].name,
			role: "reader",
		});

		req.session.token = token;

		res.send({
			message: "Login successfull",
		});

		return;
	}

	if (req.session.token) {
		res.redirect("/");
		return;
	}

	res.render("signin");
});

exports.register = asyncHandler(async (req, res, next) => {
	if (req.method === "POST") {
		if (req.session.token) {
			res.status(200).send({
				message: "Already Logged in!",
			});
			return;
		}

		const { email, pass, name } = req.body;

		const { rowCount } = await pool.query({
			text: `SELECT * FROM ${TABLE_NAME} where email=$1`,
			values: [email],
		});

		if (rowCount) {
			res.status(400).send({
				message: "User with this email already exists!",
			});
			return;
		}

		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(pass, salt);

		const { rows } = await pool.query({
			text: `INSERT INTO ${TABLE_NAME}(name, email, pass) VALUES($1, $2, $3) RETURNING id`,
			values: [name, email, hash],
		});

		const token = generateToken({
			id: rows[0].id,
			email,
			name,
			role: "reader",
		});

		req.session.token = token;

		res.send({
			message: "Login successfull",
		});

		return;
	}

	if (req.session.token) {
		res.redirect("/");
		return;
	}
	res.render("signup");
});
