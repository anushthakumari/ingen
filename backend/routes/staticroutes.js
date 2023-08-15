const express = require("express");

const { fetchPreviewBlog, getBlogSiteMap } = require("../controllers/blogs");

const router = express.Router();

router.route("/articles/:category/:slug/preview").get(fetchPreviewBlog);
router.route("/articles/:category/:slug").get(fetchPreviewBlog);
router.route("/sitemap").get(getBlogSiteMap);

module.exports = router;
