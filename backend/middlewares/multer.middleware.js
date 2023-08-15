const multer = require("multer");
const slugify = require("slugify");

module.exports = (uploadPath, allowedTypes = []) => {
	function fileFilter(req, file, cb) {
		let allowed_types = allowedTypes.length
			? [...allowedTypes]
			: [
					"image/jpg",
					"image/jpeg",
					"image/png",
					"image/webp",
					"jpg",
					"jpeg",
					"png",
					"webp",
			  ];

		console.log({ type: file.mimetype });

		if (allowed_types.includes(file.mimetype)) {
			return cb(null, true);
		} else {
			cb("Upload Error Images Only!!!", false);
		}
	}

	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, `./media/${uploadPath}`);
		},
		filename: function (req, file, cb) {
			cb(null, `${Date.now()}_${slugify(file.originalname)}`);
		},
	});

	return multer({
		storage: storage,
		limits: 1000 * 1000 * 3,
		fileFilter: fileFilter,
	});
};
