/* eslint-disable @typescript-eslint/no-explicit-any */

import { useTranslations } from 'next-intl';

import { Message, MessageMap } from './messages';

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

  return injectTranslator(messages, t as unknown as TranslatorFunc);
}

type TranslatorFunc = {
  (key: string): string;
  (key: string, values: Record<string, unknown>): string;
};

export function injectTranslator<MapType extends MessageMap>(
  map: MapType,
  t: TranslatorFunc
): UseMessagesMap<MapType> {
  const output: Record<
    string,
    HookedMessageFunc<Message<any>> | UseMessagesMap<any>
  > = {};

  Object.entries(map).forEach(([key, val]) => {
    if (isMessage(val)) {
      output[key] = (values?: Record<string, string>) => {
        return values ? t(val._id, values) : t(val._id);
      };
    } else {
      output[key] = injectTranslator(
        val,
        t
      ) as UseMessagesMap<typeof val>;
    }
  });

  return output as UseMessagesMap<MapType>;
}

export type HookedMessageFunc<MapEntry extends Message<any>> = (
  values: ReturnType<MapEntry['_typeFunc']>
) => string;

export type UseMessagesMap<MapType> = {
  [K in keyof MapType]: MapType[K] extends Message<any>
    ? HookedMessageFunc<MapType[K]>
    : UseMessagesMap<MapType[K]>;
};

function isMessage(val: MessageMap | Message<any>): val is Message<any> {
  return '_typeFunc' in val;
}
