const globals = require("../constants/globals");
const asyncHandler = require("../utils/asyncHandler");

module.exports = asyncHandler((req, res, next) => {
	res.locals.site_name = globals.APP.site_name;
    res.locals.site_title = globals.APP.title;
    res.locals.site_desc = globals.APP.site_desc;
	next();
});
