const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const router = require('./routes');

const logger = require('./logger');

const HTTPError = require('./errors/HTTPError');

const {
  COOKIE_SECRET,
} = require('./config');

const app = express();

app.use(helmet());
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Headers', 'content-type,authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT');
  next();
});
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(passport.initialize());
app.use(router);

app.use((origErr, req, res, next) => {
  if (origErr instanceof HTTPError) {
    return res.status(origErr.statusCode).json({
      code: origErr.code,
      message: origErr.message,
    });
  }
  logger.error(origErr);
  res.status(500).json({
    code: 1001,
    message: 'Unexpected error',
  });
  return next();
});

module.exports = app;
