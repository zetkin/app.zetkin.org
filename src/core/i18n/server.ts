/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from 'fs';
import path from 'path';

import { HookedMessageFunc, UseMessagesMap } from './useMessages';
import { Message, MessageMap } from './messages';

export default async function getServerMessages<MapType extends MessageMap>(
  lang: string,
  messageIds: MapType
): Promise<UseMessagesMap<MapType>> {
  // Load messages from compiled JSON
  const filePath = path.join(
    process.cwd(),
    'src',
    'locale',
    'compiled',
    `${lang}.json`
  );

  let localMessages: Record<string, string> = {};
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    localMessages = JSON.parse(fileContents);
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
          return localMessages[val._id] || val._defaultMessage;
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
