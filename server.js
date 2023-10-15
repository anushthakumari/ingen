const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const pgconnect = require("connect-pg-simple");

const errorHandler = require("./backend/middlewares/errorHandler.middleware");
const { verifyToken } = require("./backend/libs/jwt");
const sessionTokenParser = require("./backend/middlewares/tokenParser.middleware");
const apiRoutes = require("./backend/routes");
const staticroutes = require("./backend/routes/staticroutes");
const { getHome } = require("./backend/controllers/blogs");
const pool = require("./backend/libs/pool");
const allowed_roles = require("./backend/constants/allowed_editors");

require("dotenv").config();

const cookieexp = parseInt(process.env.TOKEN_EXP_MSEC); //a week
const PGSessionStore = pgconnect(sessions);

let whitelist;

if (process.env.NODE_ENV === "production") {
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

if (process.env.NODE_ENV === "production") {
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
			sameSite: process.env.NODE_ENV === "production",
			secure: process.env.NODE_ENV === "production",
			maxAge: cookieexp,
		},
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
		const token = req.session.token;
		if (!token) {
			res.redirect("/pages/creator/signin");
			return;
		}

		let decoded = verifyToken(token);

		if (!allowed_roles.includes(decoded.role)) {
			res.redirect("/pages/creator/signin");
			return;
		}

		res.cookie("role", decoded.role, {
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

app.use("/*", sessionTokenParser, getHome);

app.use(errorHandler);

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
