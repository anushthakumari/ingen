const express = require("express");

const {
	get_profile,
	updateImage,
	update_profile,
} = require("../controllers/creator");
const auth = require("../middlewares/auth.middleware");
const validation_schemas = require("../validation-schemas/creator");

const router = express.Router();

router.route("/profile/image").patch(auth, updateImage);
router
	.route("/profile")
	.get(auth, get_profile)
	.put(auth, validation_schemas.update_profile(), update_profile);

module.exports = router;
