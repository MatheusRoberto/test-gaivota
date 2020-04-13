const csv = require("fast-csv");
const ObjectId = require("mongodb").ObjectID;
const mongo = require("../../../config/mongo");

/**
 * Load FarmNVDI and append to req.
 */
function load(req, res, next, id) {
	const farmsnvdi = mongo.getDb().collection("farm-nvdi");
	farmsnvdi
		.findOne({ _id: ObjectId(id) })
		.then((farmnvdi) => {
			req.farmnvdi = farmnvdi;
			return next();
		})
		.catch((e) => next(e));
}

/**
 * Get FarmNVDI
 * @returns {FarmNVDI}
 */
function get(req, res) {
	if (req.farmnvdi) {
		return res.json(req.farmnvdi);
	}
	return res.status(404).end();
}

/**
 * Create new FarmNVDI
 * @property {Date} req.body.date - The of Date FarmNVDI
 * @property {String} req.body.ndvi_221 - The of ndvi_221 FarmNVDI
 * @property {String} req.body.ndvi_231 - The of ndvi_231 FarmNVDI
 * @property {String} req.body.ndvi_271 - The of ndvi_271 FarmNVDI
 *
 *
 * @returns {FarmNVDI}
 */
function create(req, res, next) {
	const { date, ndvi_221, ndvi_231, ndvi_271 } = req.body;
	const farmsnvdi = mongo.getDb().collection("farm-nvdi");
	farmsnvdi
		.insertOne({
			date: new Date(date),
			ndvi_221,
			ndvi_231,
			ndvi_271,
		})
		.then((result) => {
			res.status(201).json(result.ops[0]);
		})
		.catch((err) => {
			next(err);
		});
}

/**
 * Get FarmNVDI list.
 * @property {number} req.query.skip - Number of FarmNVDI to be skipped.
 * @property {number} req.query.limit - Limit number of FarmNVDI to be returned.
 * @returns {FarmNVDI[]}
 */
function list(req, res, next) {
	let { limit = 50, skip = 0 } = req.query;
	if (limit) limit = parseInt(limit);
	if (skip) skip = parseInt(skip);
	const farmsnvdi = mongo.getDb().collection("farm-nvdi");
	farmsnvdi
		.find()
		.skip(skip)
		.limit(limit)
		.toArray()
		.then((farmsnvdi) => res.json(farmsnvdi))
		.catch((e) => next(e));
}

/**
 * Update existing FarmNVDI
 * @property {Date} req.body.date - The of Date FarmNVDI
 * @property {String} req.body.ndvi_221 - The of ndvi_221 FarmNVDI
 * @property {String} req.body.ndvi_231 - The of ndvi_231 FarmNVDI
 * @property {String} req.body.ndvi_271 - The of ndvi_271 FarmNVDI
 * @returns {FarmNVDI}
 */
function update(req, res, next) {
	const { farmnvdi } = req;
	if (farmnvdi) {
		const { date, ndvi_221, ndvi_231, ndvi_271 } = req.body;

		const farmsnvdi = mongo.getDb().collection("farm-nvdi");
		farmsnvdi
			.findOneAndUpdate(
				{ _id: ObjectId(farmnvdi._id) },
				{
					$set: {
						date: new Date(date),
						ndvi_221,
						ndvi_231,
						ndvi_271,
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
 * Delete FarmNVDI.
 * @returns {FarmNVDI}
 */
function remove(req, res, next) {
	const { farmnvdi } = req;
	if (farmnvdi) {
		const farmsnvdi = mongo.getDb().collection("farm-nvdi");
		farmsnvdi
			.deleteOne({ _id: farmnvdi._id })
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
 * @returns {FarmNVDI[]}
 */
function insertCSV(req, res, next) {
	if (!req.files) return res.status(400).json("No files were uploaded.");

	const farmnvdiFile = req.files.csv;

	const farmsnvdiFile = [];
	csv
		.parseString(farmnvdiFile.data.toString("utf8"), {
			headers: true,
			ignoreEmpty: true,
		})
		.on("data", function (data) {
			data["_id"] = new ObjectId();
			data["date"] = new Date(data["date"]);
			farmsnvdiFile.push(data);
		})
		.on("end", function () {
			const farmsnvdi = mongo.getDb().collection("farm-nvdi");
			farmsnvdi
				.insertMany(farmsnvdiFile)
				.then((result) => {
					res.status(201).json(result.ops);
				})
				.catch((err) => {
					next(err);
				});
		});
}

module.exports = { create, list, load, get, update, remove, insertCSV };
