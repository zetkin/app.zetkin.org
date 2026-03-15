/**
 * Build script: Convert YAML locale files to static JSON files.
 *
 * Reads src/locale/*.yml, flattens them, applies English fallbacks,
 * and writes per-language JSON to src/locale/compiled/{lang}.json.
 *
 * These compiled files are loaded by next-intl's getRequestConfig()
 * at request time, replacing the runtime YAML parsing.
 */

import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'yaml';

const LOCALE_SRC = path.resolve(__dirname, '../src/locale');
const LOCALE_OUT = path.resolve(__dirname, '../src/locale/compiled');

type MessageList = Record<string, string>;
type MessageDB = Record<string, MessageList>;

function flattenObject(
  obj: Record<string, unknown>,
  baseKey: string | null = null,
  flat: Record<string, string> = {}
): Record<string, string> {
  Object.entries(obj).forEach(([key, val]) => {
    const combinedKey = baseKey ? `${baseKey}.${key}` : key;
    if (typeof val === 'object' && val !== null) {
      flattenObject(val as Record<string, unknown>, combinedKey, flat);
    } else if (typeof val === 'string') {
      flat[combinedKey] = val;
    }
  });
  return flat;
}

async function* findYMLFiles(dir: string): AsyncIterable<string> {
  const dirEnts = await fs.readdir(dir, { withFileTypes: true });
  for (const dirEnt of dirEnts) {
    const res = path.resolve(dir, dirEnt.name);
    if (dirEnt.isDirectory() && !res.endsWith('/compiled')) {
      yield* findYMLFiles(res);
    } else if (res.endsWith('.yml')) {
      yield res;
    }
  }
}

async function main() {
  const messages: MessageDB = {};

  // Load and flatten all YAML files
  for await (const fullPath of findYMLFiles(LOCALE_SRC)) {
    const localPath = fullPath.replace(LOCALE_SRC, '');
    const pathElems = localPath.split(path.sep).filter((elem) => elem.length);
    const fileName = pathElems.pop();
    if (fileName) {
      const dotPath = pathElems.join('.');
      const lang = fileName.replace('.yml', '');
      const content = await fs.readFile(fullPath, 'utf8');
      const data = yaml.parse(content);
      const flattened = flattenObject(data, dotPath || null);
      messages[lang] = { ...messages[lang], ...flattened };
    }
  }

  // Apply English fallback for missing keys in other languages
  Object.keys(messages).forEach((lang) => {
    if (lang !== 'en' && messages.en) {
      const withFallbacks: MessageList = { ...messages[lang] };
      Object.keys(messages.en).forEach((id) => {
        if (!withFallbacks[id]) {
          withFallbacks[id] = messages.en[id];
        }
      });
      messages[lang] = withFallbacks;
    }
  });

  // Write JSON files
  await fs.mkdir(LOCALE_OUT, { recursive: true });

  for (const [lang, msgs] of Object.entries(messages)) {
    const outPath = path.join(LOCALE_OUT, `${lang}.json`);
    await fs.writeFile(outPath, JSON.stringify(msgs));
    const sizeKB = (Buffer.byteLength(JSON.stringify(msgs)) / 1024).toFixed(1);
    console.log(`  ${lang}.json (${sizeKB} KB)`);
  }

  console.log(
    `\nGenerated ${Object.keys(messages).length} locale files in src/locale/compiled/`
  );
}

main().catch((err) => {
  console.error('Failed to generate locale JSON:', err);
  process.exit(1);
});
