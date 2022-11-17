import * as Joi from 'joi';

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'testnet', 'uat', 'test'),
	PORT: Joi.number().required(),
	USE_SWAGGER: Joi.boolean().default(false),
	API_ROOT: Joi.string().allow(''),
	USE_COMPRESSION: Joi.boolean().required(),

	// JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	// JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
	// JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	// JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

	DATABASE_URL: Joi.string().required(),
});
