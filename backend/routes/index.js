const express = require("express");

const blogsRoute = require("./blog.routes");
const userRoute = require("./user.routes");
const imagesRoute = require("./images.routes");
const catsRoute = require("./cats.routes");
const readerRoutes = require("./reader.routes");

const router = express.Router();

router.use("/blogs", blogsRoute);
router.use("/users", userRoute);
router.use("/readers", readerRoutes);
router.use("/images", imagesRoute);
router.use("/cats", catsRoute);

module.exports = router;
