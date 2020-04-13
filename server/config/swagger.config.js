// Swagger set up
const options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Gaivota Test Backend",
			version: "1.0.0",
			description: "Test para vaga de Backend",
			license: {
				name: "SEE LICENSE IN gaivota.ai/license",
			},
			contact: {
				name: "Matheus Roberto",
				url: "https://github.com/MatheusRoberto",
				email: "matheroberto@gmail.com",
			},
		},
		servers: [
			{
				url: "http://localhost:5000/api/v1",
			},
		],
	},
	apis: ["../src/server.route.js", "../src/server/auth/auth.route.js"],
};

module.exports = options;
