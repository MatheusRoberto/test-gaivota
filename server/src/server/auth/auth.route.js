const express = require("express");
const expressJwt = require("express-jwt");
const authController = require("./auth.controller");
const config = require("../../../config/config");

const router = express.Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Alexander
 *           email: fake@email.com
 */
/** POST /api/v?/login - Retorna token se username e password is correct in BD */
router.route("/login").post(authController.login);

/** GET /api/v?/auth - Rota Protegida,
 * precisa de token no cabeçalho. Authorization: Bearer {token} */
router.route("/auth").get(
	expressJwt({
		secret: config.jwtpw,
	}),
	authController.auth
);

module.exports = router;
