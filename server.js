const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const pgconnect = require("connect-pg-simple");

require("dotenv").config();

const errorHandler = require("./backend/middlewares/errorHandler.middleware");
const sessionTokenParser = require("./backend/middlewares/tokenParser.middleware");
const apiRoutes = require("./backend/routes");
const staticroutes = require("./backend/routes/staticroutes");
const { getHome } = require("./backend/controllers/blogs");
const pool = require("./backend/libs/pool");
const allowed_roles = require("./backend/constants/allowed_editors");
const { is_prod_env } = require("./backend/utils/helpers");
const jobs = require("./backend/jobs");

const is_prod = is_prod_env();
const cookieexp = parseInt(process.env.TOKEN_EXP_MSEC); //a week
const PGSessionStore = pgconnect(sessions);
const NON_REACT_ROUTES = ["/media", "/api", "/pages"];

let whitelist;

if (is_prod) {
	whitelist = ["https://www.ingenral.com"];
} else {
	whitelist = ["http://localhost:3001"];
}

const app = express();

app.set("view engine", "ejs");

app.use(
	cors({
		origin: whitelist,
		credentials: true,
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (is_prod) {
	app.set("trust proxy", 1);
}

app.use(
	sessions({
		secret: process.env.TOKEN_KEY,
		name: "sess_ing",
		store: new PGSessionStore({
			pool: pool,
			tableName: "session",
		}),
		saveUninitialized: false,
		resave: false,
		cookie: {
			sameSite: is_prod,
			secure: is_prod,
			maxAge: cookieexp,
		},
	})
);

app.use(cookieParser());

//Serve static files from the "build" directory
app.use("*", sessionTokenParser, async (req, res, next) => {
	const filename = req.originalUrl;

	//return home page
	if (filename === "/") {
		await getHome(req, res, next);
		return;
	}

	if (NON_REACT_ROUTES.some((r) => filename.startsWith(r))) {
		next();
		return;
	}

	const folderName = is_prod
		? "build"
		: filename.startsWith("/static")
		? "build"
		: "public";

	const filepath = path.join(__dirname, folderName, filename);

	//handle react routes
	if (filename.startsWith("/creator")) {
		if (!req.userData) {
			res.redirect("/pages/creator/signin");
			return;
		}

		if (!allowed_roles.includes(req.userData.role)) {
			res.redirect("/pages/creator/signin");
			return;
		}

		res.cookie("role", req.userData.role, {
			httpOnly: false,
		});

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

app.use(errorHandler);

jobs.start();

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
	//stop the jobs
	jobs.stop();

	//exit
	process.exit();
});
