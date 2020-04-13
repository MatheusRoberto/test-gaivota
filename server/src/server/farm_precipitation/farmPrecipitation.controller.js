const csv = require("fast-csv");
const ObjectId = require("mongodb").ObjectID;
const mongo = require("../../../config/mongo");

/**
 * Load FarmPrecipitation and append to req.
 */
function load(req, res, next, id) {
	const farmsprecitations = mongo.getDb().collection("farm-precipitation");
	farmsprecitations
		.findOne({ _id: ObjectId(id) })
		.then((farmprecitation) => {
			req.farmprecitation = farmprecitation;
			return next();
		})
		.catch((e) => next(e));
}

/**
 * Get FarmPrecipitation
 * @returns {FarmPrecipitation}
 */
function get(req, res) {
	if (req.farmprecitation) {
		return res.json(req.farmprecitation);
	}
	return res.status(404).end();
}

/**
 * Create new FarmPrecipitation
 * @property {Date} req.body.date - The of Date FarmPrecipitation
 * @property {Integer} req.body.precipitation_221 - The of precipitation_221 FarmPrecipitation
 * @property {Integer} req.body.precipitation_231 - The of precipitation_231 FarmPrecipitation
 * @property {Integer} req.body.precipitation_271 - The of precipitation_271 FarmPrecipitation
 *
 *
 * @returns {FarmPrecipitation}
 */
function create(req, res, next) {
	const {
		date,
		precipitation_221,
		precipitation_231,
		precipitation_271,
	} = req.body;
	const farmsprecitations = mongo.getDb().collection("farm-precipitation");
	farmsprecitations
		.insertOne({
			date: new Date(date),
			precipitation_221,
			precipitation_231,
			precipitation_271,
		})
		.then((result) => {
			res.status(201).json(result.ops[0]);
		})
		.catch((err) => {
			next(err);
		});
}

/**
 * Get FarmPrecipitation list.
 * @property {number} req.query.skip - Number of FarmPrecipitation to be skipped.
 * @property {number} req.query.limit - Limit number of FarmPrecipitation to be returned.
 * @returns {FarmPrecipitation[]}
 */
function list(req, res, next) {
	let { limit = 50, skip = 0 } = req.query;
	if (limit) limit = parseInt(limit);
	if (skip) skip = parseInt(skip);
	const farmsprecitations = mongo.getDb().collection("farm-precipitation");
	farmsprecitations
		.find()
		.skip(skip)
		.limit(limit)
		.toArray()
		.then((farmsprecitations) => res.json(farmsprecitations))
		.catch((e) => next(e));
}

/**
 * Update existing FarmPrecipitation
 * @property {Date} req.body.date - The of Date FarmPrecipitation
 * @property {Integer} req.body.precipitation_221 - The of precipitation_221 FarmPrecipitation
 * @property {Integer} req.body.precipitation_231 - The of precipitation_231 FarmPrecipitation
 * @property {Integer} req.body.precipitation_271 - The of precipitation_271 FarmPrecipitation
 * @returns {FarmPrecipitation}
 */
function update(req, res, next) {
	const { farmprecitation } = req;
	if (farmprecitation) {
		const {
			date,
			precipitation_221,
			precipitation_231,
			precipitation_271,
		} = req.body;

		const farmsprecitations = mongo.getDb().collection("farm-precipitation");
		farmsprecitations
			.findOneAndUpdate(
				{ _id: ObjectId(farmprecitation._id) },
				{
					$set: {
						date: new Date(date),
						precipitation_221,
						precipitation_231,
						precipitation_271,
					},
				},
				{ returnOriginal: false }
			)
			.then((savedFarm) => res.json(savedFarm.value))
			.catch((e) => next(e));
	} else {
		res.status(404).end();
	}
}

/**
 * Delete FarmPrecipitation.
 * @returns {FarmPrecipitation}
 */
function remove(req, res, next) {
	const { farmprecitation } = req;
	if (farmprecitation) {
		const farmsprecitations = mongo.getDb().collection("farm-precipitation");
		farmsprecitations
			.deleteOne({ _id: farmprecitation._id })
			.then((deletedFarm) => res.status(204).json(deletedFarm))
			.catch((e) => next(e));
	} else {
		res.status(404).end();
	}
}

/**
 * Create new Farmsnvdi by CSV
 * @property {File} req.files.csv - The of csv for Farm
 *
 *
 * @returns {FarmPrecipitation[]}
 */
function insertCSV(req, res, next) {
	if (!req.files) return res.status(400).json("No files were uploaded.");

	const farmprecitationFile = req.files.csv;

	const farmsprecitationsFile = [];
	csv
		.parseString(farmprecitationFile.data.toString("utf8"), {
			headers: true,
			ignoreEmpty: true,
		})
		.on("data", function (data) {
			data["_id"] = new ObjectId();
			data["date"] = new Date(data["date"]);
			data["precipitation_221"] = parseInt(data["precipitation_221"]);
			data["precipitation_231"] = parseInt(data["precipitation_231"]);
			data["precipitation_271"] = parseInt(data["precipitation_271"]);

			farmsprecitationsFile.push(data);
		})
		.on("end", function () {
			const farmsprecitations = mongo.getDb().collection("farm-precipitation");
			farmsprecitations
				.insertMany(farmsprecitationsFile)
				.then((result) => {
					res.status(201).json(result.ops);
				})
				.catch((err) => {
					next(err);
				});
		});
}

module.exports = { create, list, load, get, update, remove, insertCSV };
