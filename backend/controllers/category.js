const slugify = require("slugify");

const asyncHandler = require("../utils/asyncHandler");
const pool = require("../libs/pool");
const cat_services = require("../services/categories.services");

exports.getAllCats = asyncHandler(async (req, res, next) => {
	let q = `SELECT * FROM categories;`;

	const { rowCount, rows } = await pool.query(q);

	res.send({ message: "Fetched Successfully!", data: rows, total: rowCount });
});

exports.addCategory = asyncHandler(async (req, res, next) => {
	const { title } = req.body;

	if (!title || !title?.trim()) {
		return res.status(400).send({ message: "title is required!" });
	}

	const slug = slugify(title, {
		lower: true,
	});

	const slug_data = await cat_services.get_cat_by_slug(slug);

	if (slug_data) {
		return res.status(400).send({ message: "This category already exists!" });
	}

	let q = {
		text: `INSERT INTO categories(category, slug) VALUES ($1, $2)`,
		values: [title.trim(), slug],
	};

	await pool.query(q);

	res.send({ message: "Saved Successfully!" });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { title } = req.body;

	if (!title || !title?.trim()) {
		return res.status(400).send({ message: "title is required!" });
	}

	const slug = slugify(title, {
		lower: true,
	});

	const slug_data = await pool.query({
		text: "select * from categories where id!=$1 and slug=$2",
		values: [id, slug],
	});

	if (slug_data.rowCount) {
		return res.status(400).send({ message: "This category already exists!" });
	}

	let q = {
		text: `UPDATE categories SET category=$1, slug=$2 WHERE id=$3`,
		values: [title.trim(), slug, id],
	};

	await pool.query(q);

	res.send({ message: "Updated Successfully!" });
});

exports.deletecat = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id || !parseInt(id)) {
		return res.status(400).send("invalid category id!");
	}

	let q = "DELETE FROM categories WHERE id=" + id;

	await pool.query(q);

	res.send({ message: "Data Deleted Successfully" });
});
