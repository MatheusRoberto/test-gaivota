const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
// cookie-parser
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const httpStatus = require("http-status");
const expressWinston = require("express-winston");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const routes = require("../src/server.route");
const winstonInstance = require("./winston");
const config = require("./config");
const APIError = require("../src/server/helpers/APIError");

const app = express();

if (config.env === "dev") {
	app.use(logger("dev"));
}

// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
	})
);

// analisa os parâmetros do corpo e os anexa ao req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// configurando vários cabeçalhos HTTP
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Ativa detalhadaento da API in modo dev env
if (config.env === "dev") {
	expressWinston.requestWhitelist.push("body");
	expressWinston.responseWhitelist.push("body");
	app.use(
		expressWinston.logger({
			winstonInstance,
			meta: true, // optional: log meta data about request (defaults to true)
			msg:
				"HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
			colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
		})
	);
}

// Mountando todas as rotas em /api/v1
app.use("/api/v1", routes);

// Se o erro nao for instanceOf APIError, faz conversao.
app.use((err, req, res, next) => {
	if (!(err instanceof APIError)) {
		const apiError = new APIError(err.message, err.status, err.isPublic);
		return next(apiError);
	}
	return next(err);
});

// captura 404 e encaminha para o manipulador de erros
app.use((req, res, next) => {
	const err = new APIError("API not found", httpStatus.NOT_FOUND);
	return next(err);
});

// Manipulador de erros
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) =>
	res.status(err.status).json({
		message: err.isPublic ? err.message : httpStatus[err.status],
		stack: config.env === "dev" ? err.stack : {},
	})
);

module.exports = app;
