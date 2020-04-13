// Importa a config antes de qualquer outro arquivo
const app = require("../config/express");
const mongo = require("../config/mongo");
const config = require("../config/config");

// eslint-disable-next-line no-global-assign
Promise = require("bluebird"); //Bluebird como Default para Promise

mongo.connectToServer();

app.listen(config.port !== "undefined" ? config.port : 5000, () => {
	console.warn("App is running at http://localhost:" + config.port);
});

module.exports = app;
