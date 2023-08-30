const express = require("express");

const { fetchPreviewBlog, getBlogSiteMap } = require("../controllers/blogs");
const { register, login } = require("../controllers/reader");

const router = express.Router();

router.route("/articles/:category/:slug/preview").get(fetchPreviewBlog);
router.route("/articles/:category/:slug").get(fetchPreviewBlog);
router.route("/register").get(register);
router.route("/login").get(login);
router.route("/sitemap").get(getBlogSiteMap);

module.exports = router;
