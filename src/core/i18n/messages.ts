/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactElement } from 'react';

import globalIds from './globalIds';

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
 * Use m() to create a plain message, i.e. a message that is a simple
 * string without any external values. Use with messages(), e.g:
 *
 * export default messages({
 *   myMessage: m('Hello, world!'),
 * });
 */
export function m(defaultMessage: string): PlainMessage {
  return {
    _defaultMessage: defaultMessage,
    _id: '',
    _typeFunc: () => undefined,
  };
}

/**
 * Use im() to create an interpolated message, i.e. a message that uses
 * external values when formatted. Use with messages(), and specify the
 * Values generic type to make the values typesafe, e.g.:
 *
 * export default messages({
 *   myMessage: im<{ name: string }>('Hello, {name}'),
 * });
 *
 */
export function im<Values extends Record<string, MessageValue>>(
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
): MapType & { global: typeof globalIds } {
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

  const local = addIds(map, prefix);
  const global = addIds(globalIds, 'glob');

  return {
    ...local,
    global,
  };
}
