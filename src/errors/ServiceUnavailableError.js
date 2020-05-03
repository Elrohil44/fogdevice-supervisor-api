const HTTPError = require('./HTTPError');

class ServiceUnavailableError extends HTTPError {
  constructor(message, errorCode) {
    super({ message, errorCode, statusCode: 503 });
  }
}

module.exports = ServiceUnavailableError;
