const asyncHandler = require("../utils/asyncHandler");
const uploader = require("../middlewares/multer.middleware");
const ErrorResponse = require("../utils/ErrorResponse");
const pathModule = require("path");

const imageUploadMiddleware = (req, res, next) => {
	let { path, type } = req.query;

	const validTypes = ["single", "array"];

	if (!validTypes.includes(type)) {
		throw new ErrorResponse(
			"Invalid Type query, it can be 'single' or 'array'",
			400
		);
	}

	if (!path || !path.trim()) {
		throw new ErrorResponse("Path Must be defined in query.", 400);
	}

	const imageUpload = uploader(path);
	imageUpload[type]("images")(req, res, function (err) {
		if (err) {
			console.log(err);
			throw new ErrorResponse("Image Upload Failed!", 500);
		}

		next();
	});
};

exports.imageUpload = [
	imageUploadMiddleware,
	asyncHandler(async (req, res, next) => {
		let { type } = req.query;
		if (type === "array") {
			res.send({
				message: "upload success!",
				data: req.files.map((fd) => fd.path.split(pathModule.sep).join("/")),
			});
			return;
		}
		res.send({
			message: "upload success!",
			data: req.file.path.split(pathModule.sep).join("/"),
		});
	}),
];
