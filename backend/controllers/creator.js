const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const asyncHandler = require("../utils/asyncHandler");
const pool = require("../libs/pool");
const { generateToken } = require("../libs/jwt");
const googleAuth = require("../libs/googleAuth");
const cat_services = require("../services/categories.services");
const { EDITOR } = require("../constants/roles");
const { ORG } = require("../constants/creator_types");
const uploader = require("../middlewares/multer.middleware");
const ErrorResponse = require("../utils/ErrorResponse");

const imageUpload = uploader("profile_images");

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
			text: `INSERT INTO ${TABLE_NAME}(f_name, l_name, org_name, cat_id, email, phone, gender, pass, creator_type, profile_img_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
			values: [
				body.f_name.trim(),
				body.l_name.trim(),
				body.org_name?.trim() || null,
				parseInt(body.cat_id),
				body.email.trim(),
				body.phone.trim(),
				body.gender.trim(),
				hash,
				body.creator_type.trim(),
				"default.png",
			],
		});

		const token = generateToken({
			id: rows[0].id,
			email: body.email,
			name: body.f_name,
			role: EDITOR,
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

exports.get_profile = asyncHandler(async (req, res, next) => {
	const q = {
		text:
			"SELECT f_name, l_name, org_name, cat_id, email, phone, gender, creator_type, profile_img_name FROM " +
			TABLE_NAME +
			" WHERE id=$1",
		values: [req.userData.id],
	};

	const { rows } = await pool.query(q);
	const cats = await cat_services.get_all_cats();

	res.send({ message: "success", data: { ...rows[0], cats } });
});

exports.updateImage = [
	imageUpload["single"]("image"),
	asyncHandler(async (req, res, next) => {
		const filename = req.file.filename;

		const { rows } = await pool.query(
			`SELECT profile_img_name FROM ${TABLE_NAME} WHERE id=${req.userData.id}`
		);

		const prev_file_name = rows[0].profile_img_name;

		if (!prev_file_name || prev_file_name === "default.png") {
			return;
		}

		const full_file_path = path.join(
			"images",
			"profile_images",
			prev_file_name
		);

		//delete existing
		if (fs.existsSync(full_file_path)) {
			fs.unlinkSync(full_file_path);
		}

		const q = `update ${TABLE_NAME} set
						profile_img_name=$1
					where id=$2`;

		const values = [filename, req.userData.id];
		await pool.query({ text: q, values });

		res.send({ message: "image changed!", data: filename });
	}),
];

exports.update_profile = asyncHandler(async (req, res) => {
	const body = req.body;

	if (body.creator_type === ORG && !body.org_name?.trim()) {
		throw new ErrorResponse("Organisation name is required", 400);
	}

	const text = `UPDATE ${TABLE_NAME} set
						f_name=$1,
						l_name=$2,
						gender=$3,
						cat_id=$4,
						creator_type=$5,
						org_name=$6
				  WHERE id=$7`;
	const values = [
		body.f_name.trim(),
		body.l_name.trim(),
		body.gender.trim(),
		parseInt(body.cat_id),
		body.creator_type.trim(),
		body.org_name?.trim() || null,
		req.userData.id,
	];

	await pool.query({ text, values });

	res.send({ messgae: "updated successfully!" });
});
