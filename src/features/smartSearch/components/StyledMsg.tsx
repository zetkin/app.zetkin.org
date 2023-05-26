import { useIntl } from 'react-intl';

import UnderlinedText from './UnderlinedText';
import {
  InterpolatedMessage,
  PlainMessage,
  ValueRecord,
} from 'core/i18n/messages';

type StyledPlainMsgProps = {
  id: PlainMessage;
  values?: void;
};

type StyledInterpolatedMsgProps<Values extends ValueRecord> = {
  id: InterpolatedMessage<Values>;
  values: Values;
};

type StyledMsgProps<Values extends ValueRecord> = {
  id: PlainMessage | InterpolatedMessage<Values>;
  values?: Values;
};

function StyledMsg({ id, values }: StyledPlainMsgProps): JSX.Element;
function StyledMsg<Values extends ValueRecord>({
  id,
  values,
}: StyledInterpolatedMsgProps<Values>): JSX.Element;
function StyledMsg<Values extends ValueRecord>({
  id,
  values,
}: StyledMsgProps<Values>): JSX.Element {
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

export default StyledMsg;
