const { EmulationEnvironment } = require('../models');

const { NotFoundError } = require('../errors');

const getList = async (req) => {
  const { _id: user } = req.user;
  const {
    pagination: {
      page = 1,
      perPage = 10,
    } = {},
    sort: {
      field = '_id',
      order = 'ASC',
    } = {},
  } = req.query || {};

  const data = await EmulationEnvironment
    .find({
      user,
    })
    .select('name')
    .skip((+page - 1) * +perPage)
    .limit(+perPage)
    .sort({ [field]: order === 'ASC' ? 1 : -1 });

  const total = await EmulationEnvironment.countDocuments({
    user,
  });

  return {
    data,
    total,
  };
};

const getOne = async (req) => {
  const { _id: user } = req.user;
  const { _id } = req.params;

  const emulationEnvironment = await EmulationEnvironment.findOne({
    user,
    _id,
  });

  if (!emulationEnvironment) {
    throw new NotFoundError('Emulator was not found', 11404);
  }

  return emulationEnvironment;
};

const create = async (req) => {
  const { _id: user } = req.user;
  const {
    name,
    emulators,
    commands,
  } = req.body;

  return new EmulationEnvironment({
    user,
    name,
    emulators,
    commands,
  }).save();
};

const update = async (req) => {
  const { _id: user } = req.user;
  const { _id } = req.params;

  const updatableFields = [
    'name',
    'emulators',
    'commands',
  ];

  const $set = {};

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      $set[field] = req.body[field];
    }
  });

  const updatedEmulationEnvironment = await EmulationEnvironment.findOneAndUpdate({
    user,
    _id,
  }, {
    $set,
  }, {
    new: true,
  });

  if (!updatedEmulationEnvironment) {
    throw new NotFoundError('Emulation environment not found', 11404);
  }
  return updatedEmulationEnvironment;
};

module.exports = {
  getList,
  getOne,
  create,
  update,
};
