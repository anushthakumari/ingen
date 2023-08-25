const express = require("express");

const auth = require("../middlewares/auth.middleware");
const roleAuth = require("../middlewares/roleAuth.middleware");
const {
	getAllCats,
	addCategory,
	deletecat,
	updateCategory,
} = require("../controllers/category");

const router = express.Router();

router
	.route("/")
	.get(auth, getAllCats)
	.post(auth, roleAuth("admin"), addCategory);

router
	.route("/:id")
	.delete(auth, roleAuth("admin"), deletecat)
	.put(auth, roleAuth("admin"), updateCategory);

module.exports = router;
