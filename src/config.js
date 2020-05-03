const {
  PORT,
  MONGODB_URL,
  SALT_ROUNDS,
  JWT_PRIVATE_KEY,
  JWT_PRIVATE_KEY_PASSPHRASE,
  JWT_PUBLIC_KEY,
  COOKIE_SECRET,
  AUTH_EXPIRATION_TIME,
  AUTH_COOKIE_NAME,
} = process.env;

module.exports = {
  PORT: Number(PORT) || 5001,
  MONGODB_URL,
  SALT_ROUNDS: Number(SALT_ROUNDS) || 10,
  JWT_PRIVATE_KEY: Buffer.from(JWT_PRIVATE_KEY, 'base64'),
  JWT_PUBLIC_KEY: Buffer.from(JWT_PUBLIC_KEY, 'base64'),
  JWT_PRIVATE_KEY_PASSPHRASE,
  COOKIE_SECRET: COOKIE_SECRET || 'secret',
  AUTH_COOKIE_NAME: AUTH_COOKIE_NAME || 'auth',
  AUTH_EXPIRATION_TIME: Number(AUTH_EXPIRATION_TIME) || 12 * 60 * 60 * 1000,
  AUTH_COOKIE_OPTIONS: {
    httpOnly: true,
    signed: true,
  },
};
