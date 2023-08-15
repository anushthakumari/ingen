const slugify = require("slugify");
const moment = require("moment");

const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const pool = require("../libs/pool");
const cat_services = require("../services/categories.services");

exports.getAllBlogs = asyncHandler(async (req, res, next) => {
	let q = `SELECT blogs.*, categories.category, categories.slug as cat_slug FROM blogs left join categories on blogs.category_id=categories.id order by blog_id desc;`;

	const { rowCount, rows } = await pool.query(q);

	res.send({ message: "Fetched Successfully!", data: rows, total: rowCount });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	//delete sets
	let q = "DELETE FROM blog_sets WHERE blog_id=" + id;
	await pool.query(q);

	//delete blog
	q = "DELETE FROM blogs WHERE blog_id=" + id;
	await pool.query(q);

	res.send({ message: "Data Deleted Successfully", data: { blog_id: id } });
});

exports.createBlog = asyncHandler(async (req, res, next) => {
	const { title, desc } = req.body;
	const slug = slugify(title);
	const header_image = "media/default.jpg";

	//query
	let q = `INSERT INTO blogs ("title", "desc", "slug", "header_image") VALUES ($1, $2, $3, $4) RETURNING blog_id`;
	let values = [title, desc, slug, header_image];
	const { rows } = await pool.query({ text: q, values });

	res.status(201).send({ blog_id: rows[0].blog_id, message: "Blog Created!" });
});

exports.getSingleRawBlog = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	let q =
		"SELECT blogs.*, categories.category FROM blogs left join categories on blogs.category_id=categories.id where blog_id=$1";
	const { rows, rowCount } = await pool.query({
		text: q,
		values: [id],
	});

	const { rows: cat_rows } = await pool.query({
		text: "select * from categories order by id asc",
	});

	let data = rows[0];

	if (rowCount) {
		let q = "select * from blog_sets where blog_id=$1 order by set_id asc";
		const { rows, rowCount } = await pool.query({
			text: q,
			values: [id],
		});

		data.sets = [];
		data.cat_rows = cat_rows;

		if (rowCount) {
			data.sets.push(...rows);
		}
	}

	res.send({ message: "Fetched Successfully!", data });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const {
		header_image,
		title,
		desc,
		h1,
		h2,
		bottom_bar_h3,
		bottom_bar_h5,
		sets,
		btn_1_text,
		btn_1_url,
		btn_2_text,
		btn_2_url,
		category_id,
	} = req.body;

	console.log({ category_id });

	const slug = slugify(title);

	let q = `UPDATE blogs SET 
					title=$1,
					header_image=$2,
					h2=$3,
					h1=$4,
					"desc"=$5,
					bottom_bar_h5=$6,
					bottom_bar_h3=$7,
					btn_1_text=$8,
					btn_1_url=$9,
					btn_2_text=$10,
					btn_2_url=$11,
					slug=$12,
					blog_update_time=Now(),
					category_id=$13
				WHERE
					blog_id=$14
			`;
	let values = [
		title,
		header_image,
		h2,
		h1,
		desc,
		bottom_bar_h5,
		bottom_bar_h3,
		btn_1_text,
		btn_1_url,
		btn_2_text,
		btn_2_url,
		slug,
		category_id,
		id,
	];

	await pool.query({ text: q, values });

	if (sets.length) {
		for (let i = 0; i < sets.length; i++) {
			const setData = sets[i];

			//if not set id then insert
			if (!setData.set_id) {
				q = `INSERT INTO blog_sets 
				("para_title", "para", "single_image", "slide_image", "carousel", "blog_id") 
				VALUES ($1, $2, $3, $4, $5, $6)`;

				values = [
					setData.para_title,
					setData.para,
					setData.single_image,
					setData.slide_image,
					setData.carousel,
					id,
				];

				await pool.query({ text: q, values });
			} else {
				q = `UPDATE blog_sets SET 
					para_title=$1,
					para=$2,
					single_image=$3,
					slide_image=$4,
					carousel=$5
				WHERE
					set_id=$6
			`;
				values = [
					setData.para_title,
					setData.para,
					setData.single_image,
					setData.slide_image,
					setData.carousel,
					setData.set_id,
				];

				await pool.query({ text: q, values });
			}
		}
	}

	res.send({ message: "data updated successfully!", data: { blog_id: id } });
});

exports.fetchPreviewBlog = asyncHandler(async (req, res, next) => {
	const blog_slug = req.params.slug;
	const category = req.params.category;
	const is_preview = req.path.endsWith("/preview");

	const cat_data = await cat_services.get_cat_by_slug(category);

	if (!cat_data) {
		throw new ErrorResponse("Blog Not Found!", 404);
	}

	let q;

	if (is_preview) {
		q = `SELECT * FROM blogs WHERE slug=$1`;
	} else {
		q = `SELECT * FROM blogs WHERE slug=$1 and is_published=true`;
	}

	let { rows, rowCount } = await pool.query({ text: q, values: [blog_slug] });

	if (!rowCount) {
		throw new ErrorResponse("Blog Not Found!", 404);
	}

	let blog_data = { ...rows[0] };

	q = `SELECT * FROM blog_sets WHERE blog_id=${blog_data.blog_id} order by set_id asc`;
	let { rows: sets } = await pool.query(q);

	const context = {
		base_url: process.env.BASE_URL,
		blog_url: `${process.env.BASE_URL}pages/articles/${cat_data.slug}/${blog_data.slug}`,
		site_name: "wednow",
		author: "Team Wednow",
		author_href: process.env.BASE_URL,
		slug: blog_data.slug,
		blog_created_time: blog_data.blog_created_time,
		blog_update_time: blog_data.blog_update_time,
		headerImage: blog_data.header_image,
		title: blog_data.title,
		description: blog_data.desc,
		blog_date: moment(blog_data.blog_created_time).format("MMMM Do YYYY"),
		blog_date_iso: moment(blog_data.blog_created_time).toISOString(),
		blog_update_date: blog_data.blog_update_time
			? moment(blog_data.blog_update_time).format("MMMM Do YYYY")
			: undefined,
		blog_update_date_iso: blog_data.blog_update_time
			? moment(blog_data.blog_update_time).toISOString()
			: undefined,
		h1: blog_data.h1,
		h2: blog_data.h2,

		sets: sets.map((d) => ({
			singleImage: d.single_image,
			slideImage: d.slide_image,
			carousel: d.carousel,
			paraTitle: d.para_title,
			para: d.para,
		})),

		bottomBar: {
			//texts
			h3: blog_data.bottom_bar_h3,
			h5: blog_data.bottom_bar_h5,

			//buttons
			btn_1_text: blog_data.btn_1_text,
			btn_1_url: blog_data.btn_1_url,
			btn_2_text: blog_data.btn_2_text,
			btn_2_url: blog_data.btn_2_url,
		},
	};

	//counter will indicate how many falsy values are in
	//bottomBar property
	let numOfFalsyVals = 0;

	//create array of boolean values of Objects value
	//this will indicate if key is empty
	let booleanValuesOfBottomBar = Object.values(context.bottomBar).map(Boolean);
	for (const boolVal of booleanValuesOfBottomBar) {
		if (!boolVal) {
			numOfFalsyVals++;
		}
	}

	//if number of falsy values is equal to booleanValuesOfBottomBar length
	//that means bottomBar is empty
	context.isBottomBarSettingEmpty =
		numOfFalsyVals === booleanValuesOfBottomBar.length;

	res.render("blogs/index", context);
});

exports.getBlogSiteMap = asyncHandler(async (req, res, next) => {
	const { rows } = await pool.query(
		`select blogs.desc, title, blogs.slug, header_image, categories.slug as cat_slug from blogs left join categories on blogs.category_id=categories.id where is_published=true`
	);
	const base_url = process.env.BASE_URL;

	const blogs_text_hrefs = rows.map((e) => ({
		text: e.title,
		href: `pages/articles/${e.cat_slug}/${e.slug}`,
		desc: e.desc,
		header_image_url: e.header_image,
	}));

	const context = {
		base_url,
		blogs_text_hrefs,
		url: process.env.BASE_URL + "pages/sitemap",
		title: "Blog Sitemap Page",
		description: "site map of blog site",
		site_name: "Blogs",
	};

	res.render("blogs/sitemap", context);
});

exports.toggleBlogPublish = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { is_published: is_published_q } = req.body;
	const is_published = Boolean(is_published_q);

	let q = `UPDATE blogs SET 
					is_published=$1
				WHERE
					blog_id=$2
			`;
	let values = [is_published, id];

	await pool.query({ text: q, values });

	res.send({ message: "data updated successfully!", data: { blog_id: id } });
});
