import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl';

import {
  InterpolatedMessage,
  PlainMessage,
  ValueRecord,
} from 'core/i18n/messages';

const useStyles = makeStyles((theme) => ({
  text: {
    display: 'inline',
    textDecoration: 'underline',
    textDecorationColor: theme.palette.grey[500],
    textDecorationThickness: '2px',
    textUnderlineOffset: '5px',
  },
}));

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
  const classes = useStyles();
  const intl = useIntl();

  const descriptor = {
    defaultMessage: id._defaultMessage,
    id: id._id,
  };

  const str = values
    ? intl.formatMessage(descriptor, values)
    : intl.formatMessage(descriptor);

  return <Typography className={classes.text}>{str}</Typography>;
}

export default StyledMsg;
