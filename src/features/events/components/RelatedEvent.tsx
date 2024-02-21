import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';

import { getParticipantsStatusColor } from 'features/events/utils/eventUtils';
import messageIds from '../l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';

import getEventUrl from '../utils/getEventUrl';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface RelatedEventProps {
  event: ZetkinEvent;
}

const RelatedEvent: FC<RelatedEventProps> = ({ event }) => {
  const messages = useMessages(messageIds);
  return (
    <Box display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <NextLink href={getEventUrl(event)} legacyBehavior passHref>
          <Link>
            <Typography>
              {event.title ||
                event.activity?.title ||
                messages.common.noTitle()}
            </Typography>
          </Link>
        </NextLink>
        <ZUINumberChip
          color={getParticipantsStatusColor(
            event.num_participants_required,
            event.num_participants_available
          )}
          outlined={true}
          size="sm"
          value={`${event.num_participants_available}/${event.num_participants_required}`}
        />
      </Box>
      <Typography color="secondary">
        <ZUITimeSpan
          end={new Date(removeOffset(event.end_time))}
          start={new Date(removeOffset(event.start_time))}
        />
      </Typography>
    </Box>
  );
};

export default RelatedEvent;
