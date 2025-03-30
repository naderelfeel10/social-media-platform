const Joi = require('joi');

const signupSchema = Joi.object({
	email:Joi.string().min(6).max(60).required().email(
		{tlds:{allow:["net","com"]}}
	),
	password:Joi.string().min(8).max(60).required()
})
const createPostSchema = Joi.object({
	title: Joi.string().min(3).max(60).required(),
	description: Joi.string().min(3).max(600).required(),
	userId: Joi.string().required(),
});
module.exports = {signupSchema,createPostSchema}