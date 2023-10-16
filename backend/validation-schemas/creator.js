const { celebrate, Joi, Segments } = require("celebrate");
const { ORG, IND } = require("../constants/creator_types");

module.exports.register_user = () =>
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			f_name: Joi.string()
				.trim()
				.required()
				.regex(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/),
			l_name: Joi.string()
				.trim()
				.required()
				.regex(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/),
			org_name: Joi.string().allow(null, ""),
			phone: Joi.string().length(10).required(),
			cat_id: Joi.number().required(),
			email: Joi.string().email().trim().required().max(180),
			pass: Joi.string().required().trim().max(12),
			c_pass: Joi.string().required().trim().max(12),
			gender: Joi.string().required(),
			creator_type: Joi.string().required().valid(ORG, IND),
		}),
	});

module.exports.update_profile = () =>
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			f_name: Joi.string()
				.trim()
				.required()
				.regex(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/),
			l_name: Joi.string()
				.trim()
				.required()
				.regex(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/),
			org_name: Joi.string().allow(null, ""),
			cat_id: Joi.number().required(),
			gender: Joi.string().required(),
			creator_type: Joi.string().required().valid(ORG, IND),
		}),
	});
