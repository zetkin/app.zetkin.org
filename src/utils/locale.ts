import { promises as fs } from 'fs';
import { IncomingMessage } from 'http';
import Negotiator from 'negotiator';
import { NextApiRequest } from 'next';
import path from 'path';
import yaml from 'yaml';

export type MessageList = Record<string, string>;
type MessageDB = Record<string, MessageList>;

let MESSAGES: MessageDB | null = null;

export type SupportedLanguage = 'en' | 'sv' | 'de' | 'dk' | 'nn';

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

async function* findYMLFiles(dir: string): AsyncIterable<string> {
  const dirEnts = await fs.readdir(dir, { withFileTypes: true });
  for (const dirEnt of dirEnts) {
    const res = path.resolve(dir, dirEnt.name);
    if (dirEnt.isDirectory()) {
      yield* findYMLFiles(res);
    } else if (res.slice(-4) == '.yml') {
      yield res;
    }
  }
}

async function loadMessages(): Promise<MessageDB> {
  const basePath = path.resolve('./src/locale');
  const messages: MessageDB = {};

  for await (const fullPath of findYMLFiles('./src')) {
    const localPath = fullPath.replace(basePath, '');
    const pathElems = localPath.split(path.sep).filter((elem) => elem.length);
    const fileName = pathElems.pop();
    if (fileName) {
      const dotPath = pathElems.join('.');
      const lang = fileName.replace('.yml', '');

      const content = await fs.readFile(fullPath, 'utf8');
      const data = yaml.parse(content);
      const flattened = flattenObject(data, dotPath);

      messages[lang] = {
        ...messages[lang],
        ...flattened,
      };
    }
  }

  // Fall back to English for any strings that is missing from other languages
  Object.keys(messages).forEach((lang) => {
    if (lang !== 'en') {
      const messagesWithFallbacks: MessageList = {};
      Object.keys(messages.en).forEach((id) => {
        const val = messages[lang][id];
        messagesWithFallbacks[id] = val || messages.en[id];
      });

      messages[lang] = messagesWithFallbacks;
    }
  });

  return messages;
}

export async function getMessages(
  lang: string,
  scope: string[] = []
): Promise<MessageList> {
  if (!MESSAGES) {
    MESSAGES = await loadMessages();
  }

  const localizedMessages = MESSAGES?.en ? MESSAGES[lang] || MESSAGES.en : {};

  if (scope.length) {
    const scoped: MessageList = {};
    Object.entries(localizedMessages).forEach(([key, val]) => {
      if (scope.some((s) => key.startsWith(s))) {
        scoped[key] = val;
      }
    });

    return scoped;
  } else {
    return localizedMessages;
  }
}

export const getBrowserLanguage = (
  req: NextApiRequest | IncomingMessage
): SupportedLanguage => {
  const negotiator = new Negotiator(req);
  const languages = negotiator.languages(['en', 'nn', 'da', 'de', 'sv']);
  return languages.length ? (languages[0] as SupportedLanguage) : 'en';
};
