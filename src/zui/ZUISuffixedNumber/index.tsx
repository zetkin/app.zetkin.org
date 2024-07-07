import { FC } from 'react';
import { FormattedNumber } from 'react-intl';
import { Tooltip } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type ZUISuffixedNumberProps = {
  number: number;
};

const ZUISuffixedNumber: FC<ZUISuffixedNumberProps> = ({ number }) => {
  const messages = useMessages(messageIds.suffixedNumber);

  if (number > 9999) {
    return (
      <Tooltip arrow title={<FormattedNumber value={number} />}>
        <span>{messages.thousands({ num: Math.round(number / 1000) })}</span>
      </Tooltip>
    );
  }

  return <span>{number}</span>;
};

export default ZUISuffixedNumber;
