const sitemapJob = require("./sitemap.job");

module.exports.start = () => {
	sitemapJob.start();
};

module.exports.stop = () => {
	sitemapJob.stop();
};
