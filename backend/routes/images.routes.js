const express = require("express");

const { imageUpload } = require("../controllers/imageUpload");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/").post(auth, imageUpload);

module.exports = router;
