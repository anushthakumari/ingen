const { celebrate, Joi, Segments } = require("celebrate");

module.exports.register_user = () =>
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			name: Joi.string()
				.trim()
				.required()
				.regex(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/),
			email: Joi.string().email().trim().required().max(180),
			pass: Joi.string().required().trim().max(10),
		}),
	});
