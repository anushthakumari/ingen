const express = require("express");

const { login, register } = require("../controllers/reader");
const validation_schemas = require("../validation-schemas/users");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(validation_schemas.register_user(), register);

module.exports = router;
