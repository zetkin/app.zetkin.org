import { useTranslations } from 'next-intl';

import { AnyMessage, MessageMap } from './messages';

type TranslatorFunc = ReturnType<typeof useTranslations>;

/**
 * The useMessages() takes messages defined by the messages() function, and
 * returns a map with the same shape, except every message is a function.
 *
 * Functions generated for plain messages (that were defined using m()) take
 * no parameters, and return the localized string.
 *
 * Functions generated for interpolated messages (that were defined using im())
 * take an object as it's parameter and return the localized string. The shape
 * of the parameter must match the type defined by im<Values>().
 */
export default function useMessages<MapType extends MessageMap>(
  messages: MapType
): UseMessagesMap<MapType> {
  const t = useTranslations();

  return injectTranslator(messages, t);
}

export function injectTranslator<MapType extends MessageMap>(
  map: MapType,
  t: TranslatorFunc
): UseMessagesMap<MapType> {
  const output: Record<
    string,
    HookedMessageFunc<AnyMessage> | UseMessagesMap<MessageMap>
  > = {};

  Object.entries(map).forEach(([key, val]) => {
    if (isMessage(val)) {
      output[key] = (values?: Record<string, string>) => {
        return values ? t(val._id, values) : t(val._id);
      };
    } else {
      output[key] = injectTranslator(val, t) as UseMessagesMap<typeof val>;
    }
  });

  return output as UseMessagesMap<MapType>;
}

export type HookedMessageFunc<MapEntry extends AnyMessage> = (
  values: ReturnType<MapEntry['_typeFunc']>
) => string;

export type UseMessagesMap<MapType> = {
  [K in keyof MapType]: MapType[K] extends AnyMessage
    ? HookedMessageFunc<MapType[K]>
    : UseMessagesMap<MapType[K]>;
};

function isMessage(val: MessageMap | AnyMessage): val is AnyMessage {
  return '_typeFunc' in val;
}
