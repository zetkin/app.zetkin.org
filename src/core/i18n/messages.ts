/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactElement } from 'react';

type BaseMessage = {
  _defaultMessage: string;
  _id: string;
};

export type MessageValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | ReactElement;

export type ValueRecord = Record<string, MessageValue>;

export type PlainMessage<Values = void> = BaseMessage & {
  // This function is never used (see InterpolatedMessage)
  _typeFunc: () => Values;
};

export type InterpolatedMessage<Values = ValueRecord> = BaseMessage & {
  /**
   * This function is never used. It's just there to carry the type of
   * Values in the message, so that it can be extracted by TypeScript
   * in situations where it matters, i.e. in useMessages() and <Msg/>.
   */
  _typeFunc: (values: Values) => Values;
};

export type Message<Values extends ValueRecord> =
  | PlainMessage
  | InterpolatedMessage<Values>;

export type AnyMessage = Message<any>;

type RecursiveMap<Leaf> = { [key: string]: Leaf | RecursiveMap<Leaf> };

export type MessageMap = RecursiveMap<Message<any>>;

/**
 * Use m() to define a message, with or without interpolation values.
 * If a type variable Values is included, m() will return a message that
 * can only be used with values matching the Values type definition.
 *
 * Example:
 *
 * export default messages({
 *   hello: m<{ name: string }>('Hello, {name}'),   // requires name
 *   goodbye: m('Goodbye'),                         // no values
 * });
 */
export function m(defaultMessage: string): PlainMessage;
export function m<Values extends ValueRecord>(
  defaultMessage: string
): InterpolatedMessage<Values>;
export function m<Values extends Record<string, MessageValue>>(
  defaultMessage: string
): InterpolatedMessage<Values> {
  return {
    _defaultMessage: defaultMessage,
    _id: '',
    _typeFunc: (values: Values) => values,
  };
}

/**
 * Use the messages() function to create a map of identifiable messages
 * from an object. Objects can be nested in order to group messages. Use
 * the m() and im() functions to create the individual messages.
 *
 * The first parameter of messages() is a prefix that will be prepended
 * to all message IDs behind the scenes. In the example below, the ID of
 * the goodbye message will be 'misc.mypage.greetings.goodbye', but when
 * used with useMessages() or <Msg/>, the messages.greetings.goodbye
 * identifier can be used directly for type safety.
 *
 * Example:
 *
 * export default messages('misc.mypage', {
 *   greetings: {
 *     goodbye: m('Goodbye!'),
 *     hello: im<{ name: string }>('Hello, {name}'),
 *   },
 *   headline: 'My Page',
 * });
 */
export function makeMessages<MapType extends MessageMap>(
  prefix: string,
  map: MapType
): MapType {
  // Recursive function
  function addIds<MapType extends RecursiveMap<Message<any>>>(
    map: MapType,
    baseId: string
  ): MapType {
    const output: MapType = {} as MapType;
    Object.entries(map).forEach(([key, val]) => {
      const keyId = `${baseId}.${key}`;
      if ('_id' in val) {
        output[key as keyof MapType] = val as MapType[typeof key];
        output[key]._id = keyId;

        if (process.env.NODE_ENV == 'test') {
          // In test mode, use the ID as the key, as this is how our
          // unit tests were written, not expecting there to be any
          // localized messages (or default fallbacks)
          output[key]._defaultMessage = keyId;
        }
      } else {
        output[key as keyof MapType] = addIds(
          val,
          keyId
        ) as MapType[typeof key];
      }
    });

    return output;
  }

  return addIds(map, prefix);
}
