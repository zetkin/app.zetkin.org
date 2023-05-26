import { useIntl } from 'react-intl';

import UnderlinedText from './UnderlinedText';
import {
  InterpolatedMessage,
  PlainMessage,
  ValueRecord,
} from 'core/i18n/messages';

type UnderlinedPlainMsgProps = {
  id: PlainMessage;
  values?: void;
};

type UnderlinedInterpolatedMsgProps<Values extends ValueRecord> = {
  id: InterpolatedMessage<Values>;
  values: Values;
};

type UnderlinedMsgProps<Values extends ValueRecord> = {
  id: PlainMessage | InterpolatedMessage<Values>;
  values?: Values;
};

function UnderlinedMsg({ id, values }: UnderlinedPlainMsgProps): JSX.Element;
function UnderlinedMsg<Values extends ValueRecord>({
  id,
  values,
}: UnderlinedInterpolatedMsgProps<Values>): JSX.Element;
function UnderlinedMsg<Values extends ValueRecord>({
  id,
  values,
}: UnderlinedMsgProps<Values>): JSX.Element {
  const intl = useIntl();

  const descriptor = {
    defaultMessage: id._defaultMessage,
    id: id._id,
  };

  const str = values
    ? intl.formatMessage(descriptor, values)
    : intl.formatMessage(descriptor);

  return <UnderlinedText text={str} />;
}

export default UnderlinedMsg;
