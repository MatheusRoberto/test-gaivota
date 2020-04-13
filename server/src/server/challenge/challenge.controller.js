// const config = require("../../../config/config");
const character = [
	48,
	49,
	50,
	51,
	52,
	53,
	54,
	55,
	56,
	57,
	65,
	66,
	67,
	68,
	69,
	70,
	71,
	72,
	73,
	74,
	75,
	76,
	77,
	78,
	79,
	80,
	81,
	82,
	83,
	84,
	85,
	86,
	87,
	88,
	89,
	90,
	97,
	98,
	99,
	100,
	101,
	102,
	103,
	104,
	105,
	106,
	107,
	108,
	109,
	110,
	111,
	112,
	113,
	114,
	115,
	116,
	117,
	118,
	119,
	120,
	121,
	122,
];

function encrypt(req, res, next) {
	let { code } = req.params;
	code = parseInt(code);
	if (isNaN(code)) return res.status(400).json("Nao e um numero");
	if (code > 99999999)
		return res.status(400).json("Numero maior que o permitido");
	const keySort = Math.random() * (62 - 0) + 0;
	let key = "";
	const numberArray = code.toString().split("");
	const splittedArray = numberArray.reduce(function (
		result,
		value,
		index,
		array
	) {
		if (index % 2 === 0) result.push(array.slice(index, index + 2));
		return result;
	},
	[]);

	for (let i = 0, len = splittedArray.length; i < len; i++) {
		const concatNumber = parseInt(splittedArray[i].join(""));
		let newChar = concatNumber & keySort;

		console.log(newChar);
		console.log(String.fromCharCode(character[parseInt(newChar)]));
		key += String.fromCharCode(character[parseInt(newChar)]);
	}
	console.log(keySort);

	console.log(String.fromCharCode(character[parseInt(keySort)]));
	key += String.fromCharCode(character[parseInt(keySort)]);
	return res.status(200).json(key);
}

module.exports = { encrypt };
