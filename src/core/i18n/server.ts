/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import path from 'path';

import { HookedMessageFunc, UseMessagesMap } from './useMessages';
import { Message, MessageMap } from './messages';

// Cache compiled messages in memory
const serverMessageCache: Record<string, Record<string, unknown>> = {};

function getNestedValue(
  obj: Record<string, unknown>,
  dotPath: string
): string | undefined {
  const parts = dotPath.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export default async function getServerMessages<MapType extends MessageMap>(
  lang: string,
  messageIds: MapType
): Promise<UseMessagesMap<MapType>> {
  let localMessages: Record<string, unknown> = {};
  try {
    if (!serverMessageCache[lang]) {
      const filePath = path.join(
        process.cwd(),
        'src',
        'locale',
        'compiled',
        `${lang}.json`
      );
      serverMessageCache[lang] = JSON.parse(readFileSync(filePath, 'utf8'));
    }
    localMessages = serverMessageCache[lang];
  } catch {
    // Fall back to empty messages (will use defaultMessage)
  }

  function makeFunctions<MapType extends MessageMap>(
    map: MapType
  ): UseMessagesMap<MapType> {
    const output: Record<
      string,
      HookedMessageFunc<Message<any>> | UseMessagesMap<any>
    > = {};

    Object.entries(map).forEach(([key, val]) => {
      if (isMessage(val)) {
        output[key] = (() => {
          return getNestedValue(localMessages, val._id) || val._defaultMessage;
        }) as HookedMessageFunc<typeof val>;
      } else {
        output[key] = makeFunctions(val) as UseMessagesMap<typeof val>;
      }
    });

    return output as UseMessagesMap<MapType>;
  }

  return makeFunctions(messageIds);
}

function isMessage(val: MessageMap | Message<any>): val is Message<any> {
  return '_typeFunc' in val;
}
