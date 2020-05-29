const fs = require('fs');
const childProcess = require('child_process');

const { EmulationEnvironment } = require('../models');

const { NotFoundError } = require('../errors');

const {
  EMULATION_CONFIGS_DIR,
  PYTHON_CODE_REPOSITORY_DIR,
  TERRFORM_MAIN_FILE,
  TERRFORM_DIR,
} = require('../config');

const EMULATION_ENVIRONMENT_TEMPLATE_STRING = '{{emulation-environment-id}}';
const EMULATOR_IDS_TEMPLATE_STRING = '{{emulator-ids}}';

const TERRAFORM_MODULE_TEMPLATE = `
module "emulation_env_${EMULATION_ENVIRONMENT_TEMPLATE_STRING}" {
  source = "./modules/emulation-environment"

  emulation_environment_id = "${EMULATION_ENVIRONMENT_TEMPLATE_STRING}"
  emulator_ids = ${EMULATOR_IDS_TEMPLATE_STRING}
  mqtt_broker = docker_container.mosquitto.ip_address
  python_code_repository_volume_name = docker_volume.python_code_repository.name
  emulation_config_volume_name = docker_volume.emulation_configs.name
}
`;

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

const saveFile = async ({
  path,
  content,
  flags,
}) => {
  const stream = fs.createWriteStream(path, { flags });
  const promise = new Promise((resolve, reject) => {
    stream.on('close', resolve);
    stream.on('error', reject);
  });
  stream.end(content);
  await promise;
};

const savePythonCode = async ({
  pythonCode,
  filename,
}) => {
  await saveFile({
    path: `${PYTHON_CODE_REPOSITORY_DIR}/${filename}`,
    content: pythonCode,
  });
};

const startEmulation = async (req) => {
  const { _id } = req.params;
  const { _id: user } = req.user;


  const emulationEnvironment = await EmulationEnvironment
    .findOne({ _id, user })
    .populate('emulators.emulator');

  if (!emulationEnvironment) {
    throw new NotFoundError('Emulation environment not found', 11404);
  }

  await Promise.all((emulationEnvironment.emulators || []).map(async ({ emulator }) => {
    const { emulationType, pythonCode, _id: emulatorId } = emulator || {};
    if (emulationType === 'SOFTWARE' && pythonCode) {
      await savePythonCode({
        pythonCode,
        filename: `${emulationEnvironment._id}_${emulatorId}.py`,
      });
    }
  }));

  emulationEnvironment.depopulate('emulators.emulator');

  emulationEnvironment.emulators = emulationEnvironment.emulators
    .map(({ x, y, emulator: { _id: emulator } }) => ({
      x, y, emulator,
    }));

  const config = emulationEnvironment.toJSON();

  await saveFile({
    path: `${EMULATION_CONFIGS_DIR}/${emulationEnvironment._id}.json`,
    content: JSON.stringify(config),
  });

  const emulatorIds = (emulationEnvironment.emulators || [])
    .map((d) => d.emulator)
    .filter(Boolean)
    .map(String);

  const uniqueEmulatorIds = [...new Set(emulatorIds)];
  const emulatorIdsJSON = JSON.stringify(uniqueEmulatorIds);

  const terraformModuleEntry = TERRAFORM_MODULE_TEMPLATE
    .replace(new RegExp(EMULATION_ENVIRONMENT_TEMPLATE_STRING, 'g'), emulationEnvironment._id)
    .replace(new RegExp(EMULATOR_IDS_TEMPLATE_STRING, 'g'), emulatorIdsJSON);

  const moduleName = `emulation_env_${emulationEnvironment._id}`;

  childProcess.execSync(`perl -0777 -pi -e 's/\\nmodule "${moduleName}" {.*?}\n//s' ${TERRFORM_MAIN_FILE}`, {
    cwd: TERRFORM_DIR,
  });

  await saveFile({
    path: `${TERRFORM_DIR}/${TERRFORM_MAIN_FILE}`,
    content: terraformModuleEntry,
    flags: 'a',
  });

  childProcess.execSync(`terraform init && terraform taint -allow-missing module.${moduleName}\
.docker_container.fogdevice-environment-emulator && terraform apply -auto-approve`, {
    cwd: TERRFORM_DIR,
  });
};


const stopEmulation = async (req) => {
  const { _id } = req.params;
  const { _id: user } = req.user;


  const emulationEnvironment = await EmulationEnvironment
    .findOne({ _id, user });

  if (!emulationEnvironment) {
    throw new NotFoundError('Emulation environment not found', 11404);
  }

  childProcess.execSync(`perl -0777 -pi -e 's/\\nmodule "emulation_env_${emulationEnvironment._id}" {.*?}\n//s' ${TERRFORM_MAIN_FILE}`, {
    cwd: TERRFORM_DIR,
  });

  childProcess.execSync('terraform init && terraform apply -auto-approve', {
    cwd: TERRFORM_DIR,
  });
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  startEmulation,
  stopEmulation,
};
