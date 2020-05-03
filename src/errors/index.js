const ForbiddenError = require('./ForbiddenError');
const InternalServerError = require('./InternalServerError');
const BadRequestError = require('./BadRequestError');
const ServiceUnavailableError = require('./ServiceUnavailableError');
const UnauthorizedError = require('./UnauthorizedError');
const NotFoundError = require('./NotFoundError');

module.exports = {
  ForbiddenError,
  InternalServerError,
  BadRequestError,
  ServiceUnavailableError,
  UnauthorizedError,
  NotFoundError,
};
