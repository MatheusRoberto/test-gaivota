const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../../config/config");
const mongo = require("../../../config/mongo");

/**
 * Login route
 * @param {String} email - Email of login user
 * @param {String} password - Password of login user
 * @return {String} token
 */
async function login(req, res, next) {
	const { email, password } = req.body;
	const db = mongo.getDb();
	const user = await db.collection("user").findOne({ email, password });
	if (user) {
		const token = jwt.sign(user, config.jwtpw);
		return res.status(200).send({ userData: user, token });
	}

	const err = new APIError(
		"Authentication error",
		httpStatus.UNAUTHORIZED,
		true
	);
	return next(err);
}

function auth(req, res) {
	let token = req.header("Authorization");
	token = token.split(" ")[1];
	const ok = jwt.verify(token, config.jwtpw);
	res.status(200).send(ok);
}

module.exports = { login, auth };
