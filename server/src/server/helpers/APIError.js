const httpStatus = require("http-status");

/**
 *@extends Error
 */
class ExtendableError extends Error {
	constructor(message, status, isPublic) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isPublic = isPublic;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor.name);
	}
}

/**
 * Class representando API Error
 * @extends ExtendableError
 */

class APIError extends ExtendableError {
	/**
	 * Creates API Error
	 * @param {string} message - Messagem de erro
	 * @param {number} status - HTTP status code
	 * @param {boolean} isPublic - Messagem visivel ao usuario ou nao
	 */
	constructor(
		message,
		status = httpStatus.INTERNAL_SERVER_ERROR,
		isPublic = false
	) {
		super(message, status, isPublic);
	}
}

module.exports = APIError;
