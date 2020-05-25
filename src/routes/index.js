const express = require('express');

const auth = require('./auth');
const emulators = require('./emulators');
const emulationEnvironments = require('./emulation-environments');

const router = new express.Router();

router.use('/auth', auth);
router.use('/emulators', emulators);
router.use('/emulation-environments', emulationEnvironments);

module.exports = router;
