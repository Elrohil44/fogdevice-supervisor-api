const { Router } = require('express');
const {
  param,
} = require('express-validator');

const { passportJwt, throwOnValidationErrors } = require('../middlewares');

const { EmulationEnvironmentsController } = require('../controllers');

const router = new Router();

router.get(
  '/',
  passportJwt,
  (req, res, next) => EmulationEnvironmentsController
    .getList(req)
    .then((result) => res.json(result))
    .catch(next),
);

router.get(
  '/:_id',
  passportJwt,
  [param('_id').isMongoId()],
  throwOnValidationErrors,
  (req, res, next) => EmulationEnvironmentsController
    .getOne(req)
    .then((result) => res.json(result))
    .catch(next),
);

router.post(
  '/',
  passportJwt,
  throwOnValidationErrors,
  (req, res, next) => EmulationEnvironmentsController
    .create(req)
    .then((result) => res.status(201).json(result))
    .catch(next),
);

router.put(
  '/:_id',
  passportJwt,
  [
    param('_id').isMongoId(),
  ],
  throwOnValidationErrors,
  (req, res, next) => EmulationEnvironmentsController
    .update(req)
    .then((result) => res.status(200).json(result))
    .catch(next),
);

router.get(
  '/:_id/start',
  passportJwt,
  [
    param('_id').isMongoId(),
  ],
  throwOnValidationErrors,
  (req, res, next) => EmulationEnvironmentsController
    .startEmulation(req)
    .then(() => res.status(204).send())
    .catch(next),
);

router.get(
  '/:_id/stop',
  passportJwt,
  [
    param('_id').isMongoId(),
  ],
  throwOnValidationErrors,
  (req, res, next) => EmulationEnvironmentsController
    .stopEmulation(req)
    .then(() => res.status(204).send())
    .catch(next),
);

module.exports = router;
