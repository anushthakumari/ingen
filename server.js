const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const errorHandler = require("./backend/middlewares/errorHandler.middleware");
const apiRoutes = require("./backend/routes");
const staticroutes = require("./backend/routes/staticroutes");
const { getHome } = require("./backend/controllers/blogs");

const app = express();
require("dotenv").config();

app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Serve static files from the "build" directory
app.use("/", async (req, res, next) => {
	const filename = req.originalUrl;

	if (filename === "/") {
		return next();
	}

	const filepath = path.join(__dirname, "build", filename);

	if (filename.startsWith("/creator")) {
		return res.sendFile(path.join(__dirname, "build", "index.html"));
	}

	if (fs.existsSync(filepath)) {
		res.sendFile(filepath);
		return;
	}

	next();
});

app.use("/media", express.static("images"));
app.use("/api", apiRoutes);
app.use("/pages", staticroutes);

app.use("/*", getHome);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
