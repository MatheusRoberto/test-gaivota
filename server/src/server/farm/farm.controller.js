const csv = require("fast-csv");
const ObjectId = require("mongodb").ObjectID;
const mongo = require("../../../config/mongo");

/**
 * Load Farm and append to req.
 */
function load(req, res, next, id) {
	id = parseInt(id);
	const farms = mongo.getDb().collection("farm");
	farms
		.findOne({ $or: [{ _id: id }, { farm_id: id }] })
		.then((farm) => {
			req.farm = farm;
			return next();
		})
		.catch((e) => next(e));
}

/**
 * Get farm
 * @returns {Farm}
 */
function get(req, res) {
	if (req.farm) {
		return res.json(req.farm);
	}
	return res.status(404).end();
}

/**
 * Create new Farm
 * @property {Integer} req.body.farm_id - The of farm_id Farm
 * @property {String} req.body.name - The of name Farm
 * @property {Number} req.body.latitude - The of latitude Farm
 * @property {Number} req.body.longitude - The of longitude Farm
 * @property {String} req.body.culture - The of culture Farm
 * @property {String} req.body.variety - The of variety Farm
 * @property {Number} req.body.total_area - The of total_area Farm
 * @property {Number} req.body.yield_estimation - The of yield_estimation Farm
 * @property {Number} req.body.price - The of price Farm
 *
 *
 * @returns {Farm}
 */
function create(req, res, next) {
	const {
		farm_id,
		name,
		latitude,
		longitude,
		culture,
		variety,
		total_area,
		yield_estimation,
		price,
	} = req.body;
	const farms = mongo.getDb().collection("farm");
	farms
		.insertOne({
			_id: farm_id,
			farm_id,
			name,
			latitude,
			longitude,
			culture,
			variety,
			total_area,
			yield_estimation,
			price,
		})
		.then((result) => {
			res.status(201).json(result.ops[0]);
		})
		.catch((err) => {
			next(err);
		});
}

/**
 * Get Farm list.
 * @property {number} req.query.skip - Number of Farms to be skipped.
 * @property {number} req.query.limit - Limit number of Farms to be returned.
 * @returns {Farm[]}
 */
function list(req, res, next) {
	let { limit = 50, skip = 0 } = req.query;
	if (limit) limit = parseInt(limit);
	if (skip) skip = parseInt(skip);
	const farms = mongo.getDb().collection("farm");
	farms
		.find()
		.skip(skip)
		.limit(limit)
		.toArray()
		.then((farms) => res.json(farms))
		.catch((e) => next(e));
}

/**
 * Update existing farm
 * @property {Integer} req.body.farm_id - The of farm_id Farm
 * @property {String} req.body.name - The of name Farm
 * @property {Number} req.body.latitude - The of latitude Farm
 * @property {Number} req.body.longitude - The of longitude Farm
 * @property {String} req.body.culture - The of culture Farm
 * @property {String} req.body.variety - The of variety Farm
 * @property {Number} req.body.total_area - The of total_area Farm
 * @property {Number} req.body.yield_estimation - The of yield_estimation Farm
 * @property {Number} req.body.price - The of price Farm
 * @returns {Farm}
 */
function update(req, res, next) {
	const { farm } = req;
	if (farm) {
		const {
			name,
			latitude,
			longitude,
			culture,
			variety,
			total_area,
			yield_estimation,
			price,
		} = req.body;

		const farms = mongo.getDb().collection("farm");
		farms
			.findOneAndUpdate(
				{ _id: ObjectId(farm._id) },
				{
					$set: {
						name,
						latitude,
						longitude,
						culture,
						variety,
						total_area,
						yield_estimation,
						price,
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
 * Delete Farm.
 * @returns {Farm}
 */
function remove(req, res, next) {
	const { farm } = req;
	if (farm) {
		const farms = mongo.getDb().collection("farm");
		farms
			.deleteOne({ _id: farm._id })
			.then((deletedFarm) => res.status(204).json(deletedFarm))
			.catch((e) => next(e));
	} else {
		res.status(404).end();
	}
}

/**
 * Create new Farms by CSV
 * @property {File} req.files.csv - The of csv for Farm
 *
 *
 * @returns {Farm[]}
 */
function insertCSV(req, res, next) {
	if (!req.files) return res.status(400).json("No files were uploaded.");

	const farmFile = req.files.csv;

	const farmsFile = [];
	csv
		.parseString(farmFile.data.toString("utf8"), {
			headers: true,
			ignoreEmpty: true,
		})
		.on("data", function (data) {
			data["_id"] = parseInt(data["farm_id"]);
			data["farm_id"] = parseInt(data["farm_id"]);
			data["latitude"] = parseFloat(data["latitude"]);
			data["longitude"] = parseFloat(data["longitude"]);
			data["total_area"] = parseInt(data["total_area"]);
			data["yield_estimation"] = parseInt(data["yield_estimation"]);
			data["price"] = parseFloat(data["price"]);

			farmsFile.push(data);
		})
		.on("end", function () {
			const farms = mongo.getDb().collection("farm");
			farms
				.insertMany(farmsFile)
				.then((result) => {
					res.status(201).json(result.ops);
				})
				.catch((err) => {
					next(err);
				});
		});
}

module.exports = { create, list, load, get, update, remove, insertCSV };
