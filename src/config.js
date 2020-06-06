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
  EMULATION_CONFIGS_DIR,
  PYTHON_CODE_REPOSITORY_DIR,
  TERRFORM_MAIN_FILE,
  TERRFORM_DIR,
  ALLOW_ORIGIN,
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
  EMULATION_CONFIGS_DIR: EMULATION_CONFIGS_DIR || '/app/emulation-configs',
  PYTHON_CODE_REPOSITORY_DIR: PYTHON_CODE_REPOSITORY_DIR || '/app/python-code-repository',
  TERRFORM_MAIN_FILE: TERRFORM_MAIN_FILE || 'main.tf',
  TERRFORM_DIR: TERRFORM_DIR || '/app/terraform',
  ALLOW_ORIGIN: ALLOW_ORIGIN || 'http://localhost:3000',
};
