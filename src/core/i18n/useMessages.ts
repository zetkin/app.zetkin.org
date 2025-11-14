/* eslint-disable @typescript-eslint/no-explicit-any */

import { IntlShape, useIntl } from 'react-intl';

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
  const intl = useIntl();

  return injectIntl(messages, intl);
}

export function injectIntl<MapType extends MessageMap>(
  map: MapType,
  intl: IntlShape
): UseMessagesMap<MapType> {
  const output: Record<
    string,
    HookedMessageFunc<Message<any>> | UseMessagesMap<any>
  > = {};

  Object.entries(map).forEach(([key, val]) => {
    if (isMessage(val)) {
      output[key] = (values?: Record<string, string>) => {
        return intl.formatMessage(
          {
            defaultMessage: val._defaultMessage,
            id: val._id,
          },
          values
        );
      };
    } else {
      output[key] = injectIntl(val, intl) as UseMessagesMap<typeof val>;
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
