import { Chip } from '@mui/material';

import { useMessages } from 'core/i18n';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

interface JourneyStatusChipProps {
  instance: Pick<ZetkinJourneyInstance, 'closed'>;
}

const JourneyStatusChip: React.FC<JourneyStatusChipProps> = ({ instance }) => {
  const messages = useMessages(messageIds);
  return (
    <Chip
      data-testid="journey-status"
      label={
        instance.closed
          ? messages.journeys.statusClosed()
          : messages.journeys.statusOpen()
      }
      sx={{
        backgroundColor: instance.closed
          ? oldTheme.palette.error.main
          : oldTheme.palette.success.main,
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );
};

export default JourneyStatusChip;
