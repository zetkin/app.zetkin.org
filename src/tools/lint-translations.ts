import fs from 'fs/promises';
import { parse } from '@messageformat/parser';
import path from 'path';
import yaml from 'yaml';

run();

async function run() {
  const messagesByLang: Record<string, Record<string, string>> = {};

  const dirEnts = await fs.readdir('./src/locale', { withFileTypes: true });
  for (const dirEnt of dirEnts) {
    const fullPath = path.resolve('./src/locale', dirEnt.name);
    if (fullPath.endsWith('.yml')) {
      const fileName = path.basename(fullPath);
      const lang = fileName.replace('.yml', '');
      const content = await fs.readFile(fullPath, 'utf8');
      const data = yaml.parse(content);
      const flattened = flattenObject(data);
      messagesByLang[lang] = flattened;
    }
  }

  let numErrors = 0;
  let numWarnings = 0;

  function warn(str: string) {
    numWarnings++;
    if (process.argv.includes('--print-warnings')) {
      // eslint-disable-next-line no-console
      console.log('WARN: ', str);
    }
  }

  function error(str: string) {
    numErrors++;
    // eslint-disable-next-line no-console
    console.error('ERR: ', str);
  }

  const languages = Object.keys(messagesByLang);
  const englishEntries = messagesByLang.en;
  for (const id of Object.keys(englishEntries)) {
    const enTokens = parse(englishEntries[id]);
    const enArgs: Record<string, number> = {};
    enTokens.forEach((token) => {
      if (
        token.type == 'argument' ||
        token.type == 'plural' ||
        token.type == 'function'
      ) {
        if (!enArgs[token.arg]) {
          enArgs[token.arg] = 0;
        }

        enArgs[token.arg]++;
      }
    });
    for (const lang of languages) {
      const msg = messagesByLang[lang][id];
      if (!msg) {
        warn(`Message ${id} is missing in locale ${lang}`);
        continue;
      }

      try {
        const localTokens = parse(msg);
        const localArgs: Record<string, number> = {};
        localTokens.forEach((token) => {
          if (
            token.type == 'argument' ||
            token.type == 'plural' ||
            token.type == 'function'
          ) {
            if (!localArgs[token.arg]) {
              localArgs[token.arg] = 0;
            }
            localArgs[token.arg]++;
          }
        });

        const allArgs = new Set([
          ...Object.keys(enArgs),
          ...Object.keys(localArgs),
        ]);
        allArgs.forEach((arg) => {
          if (!localArgs[arg]) {
            error(
              `Message ${id} of locale ${lang} is not using argument ${arg}`
            );
          } else if (!enArgs[arg]) {
            error(
              `Message ${id} of locale ${lang} is using unknown argument ${arg}`
            );
          }
        });
      } catch (err) {
        error(`Message ${id} of locale ${lang} is malformed`);
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `Found ${numErrors} error(s), ${numWarnings} warning(s). Use --print-warnings to display warnings.`
  );

  process.exit(numErrors);
}

function flattenObject(
  obj: Record<string, unknown>,
  baseKey: string | null = null,
  flat: Record<string, string> = {}
) {
  Object.entries(obj).forEach(([key, val]) => {
    const combinedKey = baseKey ? `${baseKey}.${key}` : key;
    if (typeof val === 'object') {
      flattenObject(val as Record<string, unknown>, combinedKey, flat);
    } else if (typeof val === 'string') {
      flat[combinedKey] = val;
    }
  });

  return flat;
}
