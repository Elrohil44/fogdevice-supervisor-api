const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { UnauthorizedError, BadRequestError } = require('../errors');
const { mongo: { handleDuplicateKeyException } } = require('../utils');

const {
  JWT_PRIVATE_KEY,
  JWT_PRIVATE_KEY_PASSPHRASE,
  JWT_PUBLIC_KEY,
  SALT_ROUNDS,
  AUTH_EXPIRATION_TIME,
  AUTH_COOKIE_OPTIONS,
  AUTH_COOKIE_NAME,
} = require('../config');

const generateJwtToken = ({ _id, username, email }, exp) => jwt.sign(
  {
    _id: String(_id),
    username,
    email,
    exp,
  },
  {
    key: JWT_PRIVATE_KEY,
    passphrase: JWT_PRIVATE_KEY_PASSPHRASE,
  },
  {
    algorithm: 'RS512',
  },
);

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    throw new UnauthorizedError('Invalid username/email or password');
  }

  const expiresAt = Date.now() + AUTH_EXPIRATION_TIME;
  const exp = expiresAt / 1000;

  res.cookie(AUTH_COOKIE_NAME, user._id, {
    ...AUTH_COOKIE_OPTIONS,
    expires: new Date(expiresAt),
  });

  return { token: generateJwtToken(user, exp) };
};

const register = async (req, res) => {
  const {
    username, email, password, confirmPassword,
  } = req.body;
  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }

  const user = new User({
    username,
    email,
    passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
  });

  try {
    await user.save();
    const expiresAt = Date.now() + AUTH_EXPIRATION_TIME;
    const exp = expiresAt / 1000;

    res.cookie(AUTH_COOKIE_NAME, user._id, {
      ...AUTH_COOKIE_OPTIONS,
      expires: new Date(expiresAt),
    });

    return { token: generateJwtToken(user, exp) };
  } catch (e) {
    handleDuplicateKeyException(() => {
      throw new BadRequestError('Username/email is already taken');
    })(e);
    throw e;
  }
};

module.exports = {
  login,
  register,
  JWT_PUBLIC_KEY,
};
