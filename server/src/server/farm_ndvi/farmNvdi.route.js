const express = require("express");
const expressJwt = require("express-jwt");
const farmnvdiController = require("./farmNvdi.controller");
const config = require("../../../config/config");

const router = express.Router();

/**
 * Todas as rotas necessitam do token no cabeçalho. Authorization: Bearer {token}
 * */

router
	.route("/")
	/** GET /api/v?/farmnvdi - Rota Protegida
	 * Retorna Lista FarmNVDI */
	.get(
		expressJwt({
			secret: config.jwtpw,
		}),
		farmnvdiController.list
	)
	/** POST /api/v?/farmnvdi - Rota Protegida
	 * Retorna FarmNVDI */
	.post(
		expressJwt({
			secret: config.jwtpw,
		}),

		farmnvdiController.create
	);

router.route("/csv").post(
	expressJwt({
		secret: config.jwtpw,
	}),
	farmnvdiController.insertCSV
);

router
	.route("/:farmnvdiId")
	/** GET /api/v?/farmnvdi/:farmnvdiId - Get FarmNVDI */
	.get(farmnvdiController.get)
	/** PUT /api/v?/farmnvdi/:farmnvdiId - Update FarmNVDI */
	.put(farmnvdiController.update)
	/** DELETE /api/v?/farmnvdi/:farmnvdiId  - Delete FarmNVDI */
	.delete(farmnvdiController.remove);

/** Carrega FarmNVDI by FarmNVDIId in Path*/
router.param("farmnvdiId", farmnvdiController.load);

module.exports = router;
