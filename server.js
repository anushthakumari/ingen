const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const errorHandler = require("./backend/middlewares/errorHandler.middleware");
const sessionTokenParser = require("./backend/middlewares/readerTokenParser.middleware");
const apiRoutes = require("./backend/routes");
const staticroutes = require("./backend/routes/staticroutes");
const { getHome } = require("./backend/controllers/blogs");

const app = express();
require("dotenv").config();

app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	sessions({
		secret: process.env.TOKEN_KEY,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 168, //a week
			secure: process.env.ENV === "prod",
		},
		resave: false,
	})
);

app.use(cookieParser());

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

app.use("/*", sessionTokenParser, getHome);

app.use(errorHandler);

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
