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
  | ReactElement;

export type ValueRecord = Record<string, MessageValue>;

export type PlainMessage<Values = void> = BaseMessage & {
  _typeFunc: () => Values;
};

export type InterpolatedMessage<Values = ValueRecord> = BaseMessage & {
  _typeFunc: (values: Values) => Values;
};

export type Message<Values extends ValueRecord> =
  | PlainMessage
  | InterpolatedMessage<Values>;

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
 * from an object that can be nested in order to group messages. Use the
 * m() and im() functions to create the individual messages, e.g:
 *
 * export default messages({
 *   goodbye: m('Goodbye!'),
 *   hello: im<{ name: string }>('Hello, {name}'),
 * });
 */
export function messages<MapType extends MessageMap>(
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
