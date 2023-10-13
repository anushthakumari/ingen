const slugify = require("slugify");
const moment = require("moment");
const bcrypt = require("bcrypt");

const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const pool = require("../libs/pool");
const { generateToken } = require("../libs/jwt");
const googleAuth = require("../libs/googleAuth");
const cat_services = require("../services/categories.services");

const TABLE_NAME = "creators";
const saltRounds = 10;

exports.sign_up_page = asyncHandler(async (req, res, next) => {
	if (req.method === "POST") {
		if (req.session.token) {
			res.status(200).send({
				message: "Already Logged in!",
			});
			return;
		}

		const body = req.body;

		const { rowCount: email_count } = await pool.query({
			text: `SELECT * FROM ${TABLE_NAME} where email=$1`,
			values: [body.email],
		});

		if (email_count) {
			res.status(400).send({
				message: "User with this email already exists!",
			});
			return;
		}

		const { rowCount: phone_count } = await pool.query({
			text: `SELECT * FROM ${TABLE_NAME} where phone=$1`,
			values: [body.phone],
		});

		if (phone_count) {
			res.status(400).send({
				message: "User with this phone already exists!",
			});
			return;
		}

		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(body.pass, salt);

		const { rows } = await pool.query({
			text: `INSERT INTO ${TABLE_NAME}(f_name, l_name, org_name, cat_id, email, phone, gender, pass) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
			values: [
				body.f_name.trim(),
				body.l_name.trim(),
				body.org_name.trim(),
				parseInt(body.cat_id),
				body.email.trim(),
				body.phone.trim(),
				body.gender.trim(),
				hash,
			],
		});

		const token = generateToken({
			id: rows[0].id,
			email: body.email,
			name: body.f_name,
			role: "editor",
		});

		req.session.token = token;

		res.send({
			message: "Registered successfully",
		});
	} else {
		if (req.session.token) {
			res.redirect("/creator");
			return;
		}

		const cats = await cat_services.get_all_cats();

		const context = {
			cats,
		};
		res.render("creators/signup", context);
	}
});

exports.login_page = asyncHandler(async (req, res, next) => {
	if (req.method === "POST") {
		if (req.session.token) {
			res.status(200).send({
				message: "Already Logged in!",
			});
			return;
		}

		const { email, pass: password } = req.body;

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
			name: rows[0].f_name,
			role: rows[0].role,
		});

		req.session.token = token;

		res.send({
			message: "Login successfull",
		});

		return;
	}

	if (req.session.token) {
		res.redirect("/creator");
		return;
	}

	res.render("creators/signin");
});

exports.google_login = asyncHandler(async (req, res, next) => {
	const google_creds_str = req.body.credential;

	const { email } = await googleAuth.verify(google_creds_str);

	const { rows, rowCount } = await pool.query({
		text: `SELECT * FROM ${TABLE_NAME} where email=$1`,
		values: [email],
	});

	if (!rowCount) {
		const conetxt = {
			message: "User with this email doesn't exist!, Please register yourself!",
			btn_message: "Go to Register",
			btn_url: process.env.BASE_URL + "pages/creator/signup",
		};
		res.render("error_page", conetxt);
		return;
	}

	const token = generateToken({
		id: rows[0].id,
		email: rows[0].email,
		name: rows[0].f_name,
		role: rows[0].role,
	});

	req.session.token = token;

	res.redirect("/creator");
});
