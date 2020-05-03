const HTTPError = require('./HTTPError');

class UnauthorizedError extends HTTPError {
  constructor(message, errorCode) {
    super({ message, errorCode, statusCode: 401 });
  }
}

module.exports = UnauthorizedError;
