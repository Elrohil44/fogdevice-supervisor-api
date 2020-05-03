const HTTPError = require('./HTTPError');

class NotFoundError extends HTTPError {
  constructor(message, errorCode) {
    super({ message, errorCode, statusCode: 404 });
  }
}

module.exports = NotFoundError;
