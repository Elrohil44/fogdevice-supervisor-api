const HTTPError = require('./HTTPError');

class InternalServerError extends HTTPError {
  constructor(message, errorCode) {
    super({ message, errorCode, statusCode: 500 });
  }
}

module.exports = InternalServerError;
