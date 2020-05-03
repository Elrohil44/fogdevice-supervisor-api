const { Router } = require('express');
const { body } = require('express-validator');

const { throwOnValidationErrors } = require('../middlewares');

const { AuthService } = require('../services');

const {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
} = require('../config');

const router = new Router();

router.get(
  '/logout',
  (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
    res.status(204).send();
  },
);

router.post(
  '/login',
  [
    body('username')
      .trim()
      .isLength({ min: 5 })
      .customSanitizer((value) => value.toLowerCase()),
    body('password')
      .exists(),
  ],
  throwOnValidationErrors,
  (req, res, next) => AuthService
    .login(req, res)
    .then((result) => res.json(result))
    .catch(next),
);

router.post(
  '/register',
  [
    body('username')
      .isAlphanumeric()
      .trim()
      .isLength({ min: 5 })
      .customSanitizer((value) => value.toLowerCase()),
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('password')
      .isLength({ min: 5 }),
    body('confirmPassword')
      .isLength({ min: 5 }),
  ],
  throwOnValidationErrors,
  (req, res, next) => AuthService
    .register(req, res)
    .then((result) => res.status(201).json(result))
    .catch(next),
);

module.exports = router;
