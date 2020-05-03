const { validationResult } = require('express-validator');

const throwOnValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  return next();
};

module.exports = {
  throwOnValidationErrors,
};
