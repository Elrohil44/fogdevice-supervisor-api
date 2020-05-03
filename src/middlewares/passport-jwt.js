const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const { JWT_PUBLIC_KEY, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } = require('../config');

const { UnauthorizedError } = require('../errors');

const strategy = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_PUBLIC_KEY,
  algorithms: ['RS512'],
  passReqToCallback: true,
}, (req, payload, done) => {
  const idFromToken = payload && payload._id;
  const idFromCookie = req.signedCookies && req.signedCookies[AUTH_COOKIE_NAME];
  if (idFromCookie === idFromToken) {
    return done(null, payload);
  }
  return done(new UnauthorizedError('You are unauthorized to access this resource'));
});

passport.use(strategy);

const renewCookie = (req, res, next) => {
  const { _id, exp } = req.user;
  res.cookie(AUTH_COOKIE_NAME, _id, {
    ...AUTH_COOKIE_OPTIONS,
    expires: new Date(exp * 1000),
  });
  next();
};

module.exports = [
  passport.authenticate(strategy.name, { session: false }),
  renewCookie,
];
