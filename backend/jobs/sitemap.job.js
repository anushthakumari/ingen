const fs = require("fs");
const cron = require("node-cron");

const pool = require("../libs/pool");
const globals = require("../constants/globals");
const staticroutes = require("../routes/staticroutes");

async function fetchArticles() {
	const client = await pool.connect();

	try {
		// Fetch articles from the database, including category information
		const result = await client.query(`
      SELECT b.*, c.slug AS category_slug
      FROM blogs b
      JOIN categories c ON b.category_id = c.id
      WHERE b.is_published = true
    `);
		return result.rows;
	} catch (e) {
		console.log(e);
	} finally {
		client.release();
	}
}

function generateStaticSitemap(router) {
	const homePageEntry = "<url><loc>" + globals.BASE_URL + "</loc></url>";

	const routes = router.stack
		.filter((layer) => layer.route)
		.map((layer) => ({
			path: layer.route.path,
			methods: Object.keys(layer.route.methods),
		}));

	const excludedRoutes = [
		"/articles/:category/:slug",
		"/articles/:category/:slug/preview",
		"/logout",
		"/creator/google-signin",
	];

	const staticEntries = routes
		.filter((route) => !excludedRoutes.includes(route.path))
		.map((route) => {
			return `<url><loc>${globals.BASE_URL}pages${route.path}</loc></url>`;
		});

	return [homePageEntry, ...staticEntries];
}

async function generateBlogSitemap() {
	const articles = await fetchArticles();

	const blogEntries = articles.map((article) => {
		const articleUrl = `/articles/${article.category_slug}/${article.slug}`;
		return `<url><loc>${globals.BASE_URL}pages${articleUrl}</loc><lastmod>${
			article.blog_update_time || article.blog_created_time
		}</lastmod></url>`;
	});

	return blogEntries;
}

async function generateSitemap() {
	const staticEntries = generateStaticSitemap(staticroutes);
	const blogEntries = await generateBlogSitemap();

	const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join("\n")}
${blogEntries.join("\n")}
</urlset>`;

	fs.writeFileSync("./build/sitemap.xml", sitemapContent, "utf-8");
}

//run on server start also
generateSitemap();

// Schedule the cron job to run daily at midnight
// const sitemapJob = cron.schedule("*/2 * * * *", async () => {
const sitemapJob = cron.schedule("0 0 * * *", async () => {
	console.log("Generating sitemap...");
	await generateSitemap();
	console.log("Sitemap generated successfully.");
});

module.exports = sitemapJob;
