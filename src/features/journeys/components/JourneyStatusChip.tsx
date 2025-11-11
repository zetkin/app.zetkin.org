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
  return !instance.closed ? (
    <Chip
      data-testid="journey-status"
      label={messages.journeys.statusOpen()}
      sx={{
        backgroundColor: oldTheme.palette.success.main,
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  ) : (
    <Chip
      data-testid="journey-status"
      label={messages.journeys.statusClosed()}
      sx={{
        backgroundColor: oldTheme.palette.error.main,
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );
};

export default JourneyStatusChip;
