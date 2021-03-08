import { promises as fs } from 'fs';
import { resolve } from 'path';
import yaml from 'yaml';

type MessageList = Record<string,string>;
type MessageDB = Record<string,MessageList>;

let MESSAGES : MessageDB | null = null;

function flattenObject(obj : Record<string,unknown>, baseKey : string | null = null, flat : Record<string,string> = {}) {
    Object.entries(obj).forEach(([key, val]) => {
        const combinedKey = baseKey? `${baseKey}.${key}` : key;
        if (typeof val === 'object') {
            flattenObject(val as Record<string,unknown>, combinedKey, flat);
        }
        else if (typeof val === 'string') {
            flat[combinedKey] = val;
        }
    });

    return flat;
}

async function* findYMLFiles(dir : string) : AsyncIterable<string> {
    const dirEnts = await fs.readdir(dir, { withFileTypes: true });
    for (const dirEnt of dirEnts) {
        const res = resolve(dir, dirEnt.name);
        if (dirEnt.isDirectory()) {
            yield* findYMLFiles(res);
        }
        else if (res.slice(-4) == '.yml') {
            yield res;
        }
    }
}

async function loadMessages() : Promise<MessageDB> {
    const basePath = resolve('./src/locale');
    const pathEx = /\/([a-zA-Z0-9/]+)\/([a-z]{2}).yml$/;

    const messages : MessageDB = {};

    for await (const fullPath of findYMLFiles('./src/locale')) {
        const localPath = fullPath.replace(basePath, '');
        const match = pathEx.exec(localPath);
        if (match) {
            const dotPath = match[1].split('/').join('.');
            const lang = match[2];

            const content = await fs.readFile(fullPath, 'utf8');
            const data = yaml.parse(content);
            const flattened = flattenObject(data, dotPath);

            messages[lang] = {
                ...messages[lang],
                ...flattened,
            };
        }
    }

    return messages;
}

export async function getMessages(lang : string) : Promise<MessageList> {
    if (!MESSAGES) {
        MESSAGES = await loadMessages();
    }

    return MESSAGES? (MESSAGES[lang] || MESSAGES.en) : {};
}