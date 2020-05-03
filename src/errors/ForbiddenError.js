const HTTPError = require('./HTTPError');

class ForbiddenError extends HTTPError {
  constructor(message, errorCode) {
    super({ message, errorCode, statusCode: 403 });
  }
}

module.exports = ForbiddenError;
