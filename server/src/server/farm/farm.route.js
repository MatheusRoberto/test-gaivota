const express = require("express");
const expressJwt = require("express-jwt");
const farmController = require("./farm.controller");
const config = require("../../../config/config");

const router = express.Router();

/**
 * Todas as rotas necessitam do token no cabeçalho. Authorization: Bearer {token}
 * */

router
	.route("/")
	/** GET /api/v?/farm - Rota Protegida
	 * Retorna Lista Farm */
	.get(
		expressJwt({
			secret: config.jwtpw,
		}),
		farmController.list
	)
	/** POST /api/v?/farm - Rota Protegida
	 * Retorna Farm */
	.post(
		expressJwt({
			secret: config.jwtpw,
		}),

		farmController.create
	);

router.route("/csv").post(
	expressJwt({
		secret: config.jwtpw,
	}),

	farmController.insertCSV
);

router
	.route("/:farmId")
	/** GET /api/v?/farm/:farmId - Get Farm */
	.get(farmController.get)
	/** PUT /api/v?/farm/:farmId - Update Farm */
	.put(farmController.update)
	/** DELETE /api/v?/farm/:farmId  - Delete Farm */
	.delete(farmController.remove);

/** Carrega Farm by FarmId in Path*/
router.param("farmId", farmController.load);

module.exports = router;
