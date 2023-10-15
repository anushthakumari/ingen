const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const MongoDBStore = require("connect-mongodb-session");

const errorHandler = require("./backend/middlewares/errorHandler.middleware");
const { verifyToken } = require("./backend/libs/jwt");
const sessionTokenParser = require("./backend/middlewares/tokenParser.middleware");
const apiRoutes = require("./backend/routes");
const staticroutes = require("./backend/routes/staticroutes");
const { getHome } = require("./backend/controllers/blogs");

require("dotenv").config();

const allowed_roles = ["editor", "admin"];

const mongoStore = MongoDBStore(sessions);
const cookieexp = parseInt(process.env.TOKEN_EXP_MSEC); //a week
const store = new mongoStore({
	collection: "userSessions",
	uri: process.env.mongoURI,
	expires: cookieexp,
});

const app = express();

app.set("view engine", "ejs");

app.use(
	cors({
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	sessions({
		secret: process.env.TOKEN_KEY,
		name: "sess_ing",
		store: store,
		saveUninitialized: false,
		resave: false,
		cookie: {
			sameSite: false,
			secure: process.env.NODE_ENV === "production",
			maxAge: cookieexp,
			httpOnly: true,
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
