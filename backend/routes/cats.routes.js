const express = require("express");

const auth = require("../middlewares/auth.middleware");
const roleAuth = require("../middlewares/roleAuth.middleware");
const {
	getAllCats,
	addCategory,
	deletecat,
	updateCategory,
} = require("../controllers/category");
const { ADMIN } = require("../constants/roles");

const router = express.Router();

router
	.route("/")
	.get(auth, getAllCats)
	.post(auth, roleAuth(ADMIN), addCategory);

router
	.route("/:id")
	.delete(auth, roleAuth(ADMIN), deletecat)
	.put(auth, roleAuth(ADMIN), updateCategory);

module.exports = router;
