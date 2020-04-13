const Joi = require("@hapi/joi");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object({
	PORT: Joi.number().default(5000),
	JWT_PW: Joi.string().required().description("JWT PW required to sign"),
	MONGO_HOST: Joi.string().required().description("Mongo DB host url"),
	MONGO_PORT: Joi.number().default(27017),
	MONGO_DB: Joi.string()
		.required()
		.description("DB NAME")
		.default("gaivota-test"),
	NODE_ENV: Joi.string().optional(),
})
	.unknown()
	.required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}
const config = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	jwtpw: envVars.JWT_PW,
	mongo: {
		host: envVars.MONGO_HOST,
		port: envVars.MONGO_PORT,
		db: envVars.MONGO_DB,
	},
};

module.exports = config;
