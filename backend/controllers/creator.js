const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const asyncHandler = require("../utils/asyncHandler");
const pool = require("../libs/pool");
const { generateToken } = require("../libs/jwt");
const googleAuth = require("../libs/googleAuth");
const cat_services = require("../services/categories.services");
const uploader = require("../middlewares/multer.middleware");
const ErrorResponse = require("../utils/ErrorResponse");

const { EDITOR } = require("../constants/roles");
const { ORG, IND } = require("../constants/creator_types");
const globals = require("../constants/globals");

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

		// const { rowCount: phone_count } = await pool.query({
		// 	text: `SELECT * FROM ${TABLE_NAME} where phone=$1`,
		// 	values: [body.phone],
		// });

		// if (phone_count) {
		// 	res.status(400).send({
		// 		message: "User with this phone already exists!",
		// 	});
		// 	return;
		// }

		if (body.pass.trim() !== body.c_pass.trim()) {
			res.status(400).send({
				message: "passwords didn't match!",
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
				null,
				1,
				body.email.trim(),
				null,
				"male",
				hash,
				IND,
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
			url: globals.BASE_URL + "pages/creator/signup",
			title: "InGenral | Creator Sign Up",
			description:
				"Become a contributor on inGenral by signing up as a creator. Join our platform to share your unique political perspectives with a global audience. As a registered creator, you'll have the tools and support to publish articles, express expert opinions, and contribute to the diverse landscape of political content. Start your journey as a creator on inGenral by signing up for a free account. Join our community of influencers and thought leaders, and make a lasting impact on the world of political journalism.",
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

	const context = {
		url: globals.BASE_URL + "pages/creator/signin",
		title: "InGenral | Creator Sign In",
		description:
			"Creators, sign in to inGenral to manage and contribute your unique political content. Access tools and features designed for creators, and share your perspectives with our engaged audience. As a creator on inGenral, you'll have the opportunity to publish articles, share expert opinions, and contribute to the dynamic political discourse. Sign in now to unleash your creative potential and make a meaningful impact in the world of political journalism.",
	};

	res.render("creators/signin", context);
});

exports.google_login = asyncHandler(async (req, res, next) => {
	const google_creds_str = req.body.credential;

	const { email, given_name, family_name, name } = await googleAuth.verify(
		google_creds_str
	);

	let { rows, rowCount } = await pool.query({
		text: `SELECT * FROM ${TABLE_NAME} where email=$1`,
		values: [email],
	});

	let token;
	let path;

	//register user
	if (!rowCount) {
		const pass = `${email}_${given_name}`;
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(pass, salt);

		const { rows: insertedRows } = await pool.query({
			text: `INSERT INTO ${TABLE_NAME}(f_name, l_name, org_name, cat_id, email, phone, gender, pass, creator_type, profile_img_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
			values: [
				given_name,
				family_name ? family_name : name,
				null,
				1,
				email,
				null,
				"male",
				hash,
				IND,
				"default.png",
			],
		});

		token = generateToken({
			id: insertedRows[0].id,
			email: email,
			name: given_name,
			role: EDITOR,
		});

		path = "/creator/profile";
	} else {
		//login user
		token = generateToken({
			id: rows[0].id,
			email: rows[0].email,
			name: rows[0].f_name,
			role: rows[0].role,
		});

		path = "/creator";
	}

	req.session.token = token;

	res.redirect(path);
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

		//delete existing
		if (prev_file_name && prev_file_name !== "default.png") {
			const full_file_path = path.join(
				"images",
				"profile_images",
				prev_file_name
			);

			if (fs.existsSync(full_file_path)) {
				fs.unlinkSync(full_file_path);
			}
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

	if (body.phone) {
		const phone = body.phone.trim();

		const { rowCount: phone_count } = await pool.query({
			text: `SELECT * FROM ${TABLE_NAME} where phone=$1 and id!=$2`,
			values: [phone, req.userData.id],
		});

		if (phone_count) {
			res.status(400).send({
				message: "User with this phone already exists!",
			});
			return;
		}
	}

	const text = `UPDATE ${TABLE_NAME} set
						f_name=$1,
						l_name=$2,
						gender=$3,
						cat_id=$4,
						creator_type=$5,
						org_name=$6,
						phone=$7
				  WHERE id=$8`;
	const values = [
		body.f_name.trim(),
		body.l_name.trim(),
		body.gender.trim(),
		parseInt(body.cat_id),
		body.creator_type.trim(),
		body.org_name?.trim() || null,
		body.phone?.trim() || null,
		req.userData.id,
	];

	await pool.query({ text, values });

	res.send({ messgae: "updated successfully!" });
});
