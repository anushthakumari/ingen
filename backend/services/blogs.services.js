const pool = require("../libs/pool");

module.exports.get_blog_owner_id = async (blog_id, slug = "none") => {
	let q = {
		text: "",
		values: [],
	};

	if (blog_id) {
		q.text = "SELECT created_by FROM blogs WHERE blog_id=$1";
		q.values = [blog_id];
	} else {
		q.text = "SELECT created_by FROM blogs WHERE slug=$1";
		q.values = [slug];
	}

	const { rowCount, rows } = await pool.query(q);

	if (rowCount) {
		return rows[0].created_by;
	}

	return false;
};
