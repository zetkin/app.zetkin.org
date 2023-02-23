/* eslint-disable @typescript-eslint/no-explicit-any */

import { useIntl } from 'react-intl';

import { Message, MessageMap, MessageValue } from './messages';

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
): HookedMessageMap<MapType> {
  const intl = useIntl();

  function injectIntl<MapType extends MessageMap>(
    map: MapType
  ): HookedMessageMap<MapType> {
    const output: Record<
      string,
      HookedMessageFunc<Message<any>> | HookedMessageMap<any>
    > = {};

    Object.entries(map).forEach(([key, val]) => {
      if (isMessage(val)) {
        output[key] = ((values?: Record<string, MessageValue>) => {
          return intl.formatMessage(
            {
              defaultMessage: val._defaultMessage,
              id: val._id,
            },
            values
          );
        }) as HookedMessageFunc<typeof val>;
      } else {
        output[key] = injectIntl(val) as HookedMessageMap<typeof val>;
      }
    });

    return output as HookedMessageMap<MapType>;
  }

  return injectIntl(messages);
}

type HookedMessageFunc<MapEntry extends Message<any>> = (
  values: ReturnType<MapEntry['_typeFunc']>
) => string;

type HookedMessageMap<MapType> = {
  [K in keyof MapType]: MapType[K] extends Message<any>
    ? HookedMessageFunc<MapType[K]>
    : HookedMessageMap<MapType[K]>;
};

function isMessage(val: MessageMap | Message<any>): val is Message<any> {
  return '_typeFunc' in val;
}
