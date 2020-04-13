const express = require("express");
const expressJwt = require("express-jwt");
const farmPrecipitationController = require("./farmPrecipitation.controller");
const config = require("../../../config/config");

const router = express.Router();

/**
 * Todas as rotas necessitam do token no cabeçalho. Authorization: Bearer {token}
 * */

router
	.route("/")
	/** GET /api/v?/farmprecipitation - Rota Protegida
	 * Retorna Lista FarmPrecipitation */
	.get(
		expressJwt({
			secret: config.jwtpw,
		}),
		farmPrecipitationController.list
	)
	/** POST /api/v?/farmprecipitation - Rota Protegida
	 * Retorna FarmPrecipitation */
	.post(
		expressJwt({
			secret: config.jwtpw,
		}),

		farmPrecipitationController.create
	);

/** POST /api/v?/farmprecipitation/csv - Rota Protegida
 * Retorna FarmPrecipitation[] */
router.route("/csv").post(
	expressJwt({
		secret: config.jwtpw,
	}),
	farmPrecipitationController.insertCSV
);

router
	.route("/:farmprecipitationId")
	/** GET /api/v?/farmprecipitation/:farmprecipitationId - Get FarmPrecipitation */
	.get(farmPrecipitationController.get)
	/** PUT /api/v?/farmprecipitation/:farmprecipitationId - Update FarmPrecipitation */
	.put(farmPrecipitationController.update)
	/** DELETE /api/v?/farmprecipitation/:farmprecipitationId  - Delete FarmPrecipitation */
	.delete(farmPrecipitationController.remove);

/** Carrega FarmPrecipitation by FarmPrecipitationId in Path*/
router.param("farmprecipitationId", farmPrecipitationController.load);

module.exports = router;
