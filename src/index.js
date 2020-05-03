const app = require('./express');
const db = require('./db');
const logger = require('./logger');

const { PORT } = process.env;

const run = async () => {
  await db.connect();
  logger.info('MongoDB connected');
  app.listen(PORT);
  logger.info('App listening');
};

run().catch((error) => {
  logger.error(error);
  process.exit(1);
});
