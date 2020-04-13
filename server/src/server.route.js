const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const router = express.Router();

const authRoutes = require("./server/auth/auth.route");
const farmRoutes = require("./server/farm/farm.route");
const farmNvdiRoutes = require("./server/farm_ndvi/farmNvdi.route");
const farmPrecipitationRoutes = require("./server/farm_precipitation/farmPrecipitation.route");
const challengeRoutes = require("./server/challenge/challenge.route");
const swaggerDocument = YAML.load("./swagger.yaml");

/**
 * GET
 * Health-check
 */
router.get("/", (req, res) => {
	res.status(200).send("Gaivota Test");
});

router.use(authRoutes);
router.use("/farm", farmRoutes);
router.use("/farmnvdi", farmNvdiRoutes);
router.use("/farmprecipitation", farmPrecipitationRoutes);
router.use("/challenge", challengeRoutes);

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerDocument, { explorer: true }));

module.exports = router;
