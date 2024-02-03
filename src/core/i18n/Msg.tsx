import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import { InterpolatedMessage, PlainMessage, ValueRecord } from './messages';

/**
 * The <Msg/> component allows you to render a localized message that was
 * defined using the messages() function from core/i18n, in a type-safe way.
 *
 * There are two overloads, to handle interpolated messages (from im()) and
 * plain messages (from m()) differently. The values property is only
 * accepted for interpolated messages, and must be the correct type, i.e. the
 * one specified when the message was defined using im<Values>().
 */
function Msg({ id, values }: PlainMsgProps): JSX.Element;
function Msg<Values extends ValueRecord>({
  id,
  values,
}: InterpolatedMsgProps<Values>): JSX.Element;
function Msg<Values extends ValueRecord>({
  id,
  values,
}: MsgProps<Values>): ReactNode {
  const intl = useIntl();

  const descriptor = {
    defaultMessage: id._defaultMessage,
    id: id._id,
  };

  const str = values
    ? intl.formatMessage(descriptor, values)
    : intl.formatMessage(descriptor);

  return str;
}

export default Msg;

type PlainMsgProps = {
  id: PlainMessage;
  values?: void;
};

type InterpolatedMsgProps<Values extends ValueRecord> = {
  id: InterpolatedMessage<Values>;
  values: Values;
};

type MsgProps<Values extends ValueRecord> = {
  id: PlainMessage | InterpolatedMessage<Values>;
  values?: Values;
};
