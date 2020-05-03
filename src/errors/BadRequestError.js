const HTTPError = require('./HTTPError');

class BadRequestError extends HTTPError {
  constructor(message, errorCode) {
    super({ message, errorCode, statusCode: 400 });
  }
}

module.exports = BadRequestError;
