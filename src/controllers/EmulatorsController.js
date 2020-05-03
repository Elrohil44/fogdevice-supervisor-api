const { Emulator } = require('../models');

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

  const data = await Emulator
    .find({
      user,
    })
    .select('name emulationType')
    .skip((+page - 1) * +perPage)
    .limit(+perPage)
    .sort({ [field]: order === 'ASC' ? 1 : -1 });

  const total = await Emulator.countDocuments({
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

  const emulator = await Emulator.findOne({
    user,
    _id,
  }).select('pythonCode emulationType name');

  if (!emulator) {
    throw new NotFoundError('Emulator was not found', 11404);
  }

  return emulator;
};

const create = async (req) => {
  const { _id: user } = req.user;
  const {
    name,
    emulationType,
    pythonCode,
  } = req.body;

  return new Emulator({
    user,
    name,
    emulationType,
    pythonCode,
  }).save();
};

const update = async (req) => {
  const { _id: user } = req.user;
  const { _id } = req.params;

  const updatableFields = [
    'name',
    'emulationType',
    'pythonCode',
  ];

  const $set = {};

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      $set[field] = req.body[field];
    }
  });

  const updatedEmulator = await Emulator.findOneAndUpdate({
    user,
    _id,
  }, {
    $set,
  }, {
    new: true,
  });

  if (!updatedEmulator) {
    throw new NotFoundError('Emulator not found', 11404);
  }
  return updatedEmulator;
};

module.exports = {
  getList,
  getOne,
  create,
  update,
};
