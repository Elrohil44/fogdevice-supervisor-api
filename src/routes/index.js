const express = require('express');

const auth = require('./auth');
const emulators = require('./emulators');

const router = new express.Router();

router.use('/auth', auth);
router.use('/emulators', emulators);

module.exports = router;
