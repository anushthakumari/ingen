const express = require("express");

const { fetchPreviewBlog, getBlogSiteMap } = require("../controllers/blogs");
const { register, login, log_out } = require("../controllers/reader");
const {
	login_page,
	sign_up_page,
	google_login,
} = require("../controllers/creator");

const router = express.Router();

router.route("/articles/:category/:slug/preview").get(fetchPreviewBlog);
router.route("/articles/:category/:slug").get(fetchPreviewBlog);
router.route("/register").get(register);
router.route("/login").get(login);
router.route("/logout").get(log_out);
router.route("/creator/signup").get(sign_up_page).post(sign_up_page);
router.route("/creator/signin").get(login_page).post(login_page);
router.route("/creator/google-signin").get(google_login).post(google_login);
router.route("/sitemap").get(getBlogSiteMap);

module.exports = router;
