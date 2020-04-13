const express = require("express");
const expressJwt = require("express-jwt");
const challengeController = require("./challenge.controller");
const config = require("../../../config/config");

const router = express.Router();

/** GET /api/v?/challenge/enconde/:code - Rota Protegida,
 * precisa de token no cabeçalho. Authorization: Bearer {token} */
/**
 * Rota resposavel por encode number
 */
router.route("/encode/:code").get(
	expressJwt({
		secret: config.jwtpw,
	}),
	challengeController.encrypt
);

module.exports = router;
