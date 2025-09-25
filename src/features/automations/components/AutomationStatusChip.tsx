import { FC } from 'react';
import { Chip } from '@mui/material';

import { ZetkinBulkAutomation } from '../types/api';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  automation: ZetkinBulkAutomation;
};

const AutomationStatusChip: FC<Props> = ({ automation }) => {
  const messages = useMessages(messageIds);

  return (
    <Chip
      color={automation.active ? 'success' : 'secondary'}
      label={
        automation.active
          ? messages.labels.status.active()
          : messages.labels.status.inactive()
      }
      size="small"
    />
  );
};

export default AutomationStatusChip;
