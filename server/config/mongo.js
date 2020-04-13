const MongoClient = require("mongodb").MongoClient;
const config = require("./config");
const url = `mongodb://${config.mongo.host}:${config.mongo.port}`;
const client = new MongoClient(url, {
	useUnifiedTopology: true,
	promiseLibrary: require("bluebird"),
});
let _db;
module.exports = {
	connectToServer: () => {
		client.connect(async (err) => {
			if (err) console.error(err);
			console.warn(`Mongo connected in ${config.mongo.port}`);
			_db = client.db(config.mongo.db);
			await _db.collection("user").deleteMany({
				email: "admin@gaivota.ai",
			});
			await _db.collection("user").insertOne({
				name: "Admin",
				email: "admin@gaivota.ai",
				password: "admin",
			});
			console.warn("Admin inserted");
			return true;
		});
	},

	getDb: () => {
		return _db;
	},
};
