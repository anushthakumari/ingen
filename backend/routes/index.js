const express = require("express");

const blogsRoute = require("./blog.routes");
const userRoute = require("./user.routes");
const imagesRoute = require("./images.routes");

const router = express.Router();

router.use("/blogs", blogsRoute);
router.use("/users", userRoute);
router.use("/images", imagesRoute);

module.exports = router;
