import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { EventState } from 'features/events/hooks/useEventState';
import messageIds from 'features/events/l10n/messageIds';
import StatusDot from '../StatusDot';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';

interface ClusterHeaderProps {
  event: ZetkinEvent;
  state: EventState;
}

const ClusterHeader: FC<ClusterHeaderProps> = ({ event, state }) => {
  const messages = useMessages(messageIds);
  return (
    <>
      <Typography variant="h5">
        {event.title || event.activity?.title || messages.common.noTitle()}
      </Typography>
      <Box alignItems="center" display="flex">
        {<StatusDot state={state} />}
        <Typography color="secondary">
          {event.activity?.title || messages.common.noActivity()}
        </Typography>
      </Box>
    </>
  );
};

export default ClusterHeader;
