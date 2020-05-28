const mongoose = require('mongoose');

const { MONGODB_URL } = process.env;

const connect = async () => mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

module.exports = {
  connect,
};
