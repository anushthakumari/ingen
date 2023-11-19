const bcrypt = require("bcrypt");

const asyncHandler = require("../utils/asyncHandler");
const pool = require("../libs/pool");
const { generateToken } = require("../libs/jwt");

const { READER } = require("../constants/roles");
const globals = require("../constants/globals");
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
			role: READER,
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

	const context = {
		url: globals.BASE_URL + "pages/login",
		title: "InGenral | Reader Login",
		description:
			"Securely log in to inGenral and access a personalized reading experience. Engage with high-quality political content tailored to your interests. Join our community of informed readers, where you can explore in-depth articles, expert opinions, and breaking news on political events. Your inGenral reader account provides a seamless and curated news journey. Log in now for an enriched reading experience and stay updated on the latest political insights.",
	};

	res.render("signin", context);
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
			role: READER,
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

	const context = {
		url: globals.BASE_URL + "pages/register",
		title: "InGenral | Reader Register",
		description:
			"Join inGenral and unlock a world of curated political insights. Register for a reader account to personalize your news feed, participate in discussions, and access exclusive content. As a registered reader, you'll stay informed with in-depth articles, expert opinions, and breaking news on political events. Be part of our vibrant community, share your perspectives, and connect with like-minded individuals. Start your inGenral reader journey today by signing up for a free account.",
	};

	res.render("signup", context);
});

exports.log_out = asyncHandler(async (req, res) => {
	const redirect_path = req.params.redirect || "";
	req.session.destroy();
	res.redirect("/" + redirect_path);
});
