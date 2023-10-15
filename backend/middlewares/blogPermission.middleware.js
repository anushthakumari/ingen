const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const { get_blog_owner_id } = require("../services/blogs.services");

const { ADMIN } = require("../constants/roles");

module.exports = asyncHandler(async (req, res, next) => {
	//if admind
	if (req.userData.role === ADMIN) {
		next();
		return;
	}

	const blog_id = req.params.id;
	const creator_id = await get_blog_owner_id(blog_id);

	//if not the owner of the blog
	if (creator_id !== req.userData.id) {
		return next(new ErrorResponse("You're Not Authorized.", 401));
	}

	next();
});
