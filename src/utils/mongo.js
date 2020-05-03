const DUPLICATE_KEY_EXCEPTION_ERROR_CODE = 11000;

const handleDuplicateKeyException = (cb) => (error) => {
  if (
    error.name === 'MongoError'
    && error.code === DUPLICATE_KEY_EXCEPTION_ERROR_CODE
  ) {
    cb(error);
    return;
  }
  throw error;
};

module.exports = {
  handleDuplicateKeyException,
};
