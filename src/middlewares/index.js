const passportJwt = require('./passport-jwt');
const { throwOnValidationErrors } = require('./validation');

module.exports = {
  passportJwt,
  throwOnValidationErrors,
};
