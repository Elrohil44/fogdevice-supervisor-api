class HTTPError extends Error {
  constructor({ message, errorCode, statusCode } = {}) {
    super(message);
    this.code = errorCode;
    this.statusCode = statusCode;
  }
}

module.exports = HTTPError;
