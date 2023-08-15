const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const errorHandler = require("./backend/middlewares/errorHandler.middleware");
const apiRoutes = require("./backend/routes");
const staticroutes = require("./backend/routes/staticroutes");

const app = express();
require("dotenv").config();

app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use("/pages", staticroutes);

// // Serve static files from the "build" directory
app.use(express.static("build"));
app.use("/media", express.static("media"));

// Serve the index.html file for all routes
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(errorHandler);

const port = 80;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
