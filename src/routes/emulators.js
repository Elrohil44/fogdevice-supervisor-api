const { Router } = require('express');
const { param, body, oneOf } = require('express-validator');

const { passportJwt, throwOnValidationErrors } = require('../middlewares');

const { EmulatorsController } = require('../controllers');

const router = new Router();

router.get(
  '/',
  passportJwt,
  (req, res, next) => EmulatorsController
    .getList(req)
    .then((result) => res.json(result))
    .catch(next),
);

router.get(
  '/:_id',
  passportJwt,
  [param('_id').isMongoId()],
  throwOnValidationErrors,
  (req, res, next) => EmulatorsController
    .getOne(req)
    .then((result) => res.json(result))
    .catch(next),
);

router.post(
  '/',
  passportJwt,
  [
    body('name')
      .exists({ checkFalsy: true })
      .isString(),
    oneOf([
      [
        body('emulationType').equals('SOFTWARE'),
        body('pythonCode')
          .exists({ checkFalsy: true })
          .isString(),
      ],
      body('emulationType').equals('HARDWARE'),
    ]),
  ],
  throwOnValidationErrors,
  (req, res, next) => EmulatorsController
    .create(req)
    .then((result) => res.status(201).json(result))
    .catch(next),
);

router.put(
  '/:_id',
  passportJwt,
  [
    body('name')
      .exists({ checkFalsy: true })
      .isString(),
    oneOf([
      [
        body('emulationType').equals('SOFTWARE'),
        body('pythonCode')
          .exists({ checkFalsy: true })
          .isString(),
      ],
      body('emulationType').equals('HARDWARE'),
    ]),
    param('_id').isMongoId(),
  ],
  throwOnValidationErrors,
  (req, res, next) => EmulatorsController
    .update(req)
    .then((result) => res.status(200).json(result))
    .catch(next),
);

module.exports = router;
