/* eslint-disable @typescript-eslint/no-explicit-any */
import IntlMessageFormat from 'intl-messageformat';

import { getMessages } from 'utils/locale';
import { HookedMessageFunc, UseMessagesMap } from './useMessages';
import { Message, MessageMap, MessageValue } from './messages';

export default async function getServerMessages<MapType extends MessageMap>(
  lang: string,
  messageIds: MapType
): Promise<UseMessagesMap<MapType>> {
  const localMessages = await getMessages(lang);

  function makeFunctions<MapType extends MessageMap>(
    map: MapType
  ): UseMessagesMap<MapType> {
    const output: Record<
      string,
      HookedMessageFunc<Message<any>> | UseMessagesMap<any>
    > = {};

    Object.entries(map).forEach(([key, val]) => {
      if (isMessage(val)) {
        output[key] = ((values?: Record<string, MessageValue>) => {
          // TODO: Cache this compilation?
          const msg = localMessages[val._id] || val._defaultMessage;
          const fmt = new IntlMessageFormat(msg, [lang, 'en']);
          return fmt.format(values);
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
