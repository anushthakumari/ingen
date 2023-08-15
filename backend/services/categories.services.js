const pool = require("../libs/pool");

async function get_cat_by_slug(slug = "") {
	const q = {
		text: "select * from categories where slug=$1",
		values: [slug],
	};

	const { rows, rowCount } = await pool.query(q);

	if (!rowCount) {
		return null;
	}

	return rows[0];
}

async function get_cat_by_id(id = 0) {
	const q = {
		text: "select * from categories where id=$1",
		values: [id],
	};

	const { rows, rowCount } = await pool.query(q);

	if (!rowCount) {
		return null;
	}

	return rows[0];
}

module.exports = {
	get_cat_by_slug,
	get_cat_by_id,
};
