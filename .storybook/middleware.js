const fs = require('fs/promises');
const path = require('path');
const yaml = require('yaml');

function flattenObject(obj, baseKey, flat = {}) {
  Object.entries(obj).forEach(([key, val]) => {
    const combinedKey = baseKey ? `${baseKey}.${key}` : key;
    if (typeof val === 'object') {
      flattenObject(val, combinedKey, flat);
    } else if (typeof val === 'string') {
      flat[combinedKey] = val;
    }
  });

  return flat;
}

async function* findYMLFiles(dir) {
  const dirEnts = await fs.readdir(dir, { withFileTypes: true });
  for (const dirEnt of dirEnts) {
    const res = path.resolve(dir, dirEnt.name);
    if (dirEnt.isDirectory()) {
      yield* findYMLFiles(res);
    } else if (res.slice(-6) == 'en.yml') {
      yield res;
    }
  }
}

async function loadMessages() {
  const basePath = path.resolve('./src/locale');
  let messages = {};

  for await (const fullPath of findYMLFiles('./src/locale')) {
    const localPath = fullPath.replace(basePath, '');
    const pathElems = localPath.split(path.sep).filter((elem) => elem.length);
    const fileName = pathElems.pop();
    if (fileName) {
      const dotPath = pathElems.join('.');

      const content = await fs.readFile(fullPath, 'utf8');
      const data = yaml.parse(content);
      const flattened = flattenObject(data, dotPath);

      messages = {
        ...messages,
        ...flattened,
      };
    }
  }

  return messages;
}

module.exports = async (router) => {
  router.get('/l10n_messages', async (req, res) => {
    const messages = await loadMessages();
    res.json({
      messages: messages,
      messages: {},
    });
  });
};
