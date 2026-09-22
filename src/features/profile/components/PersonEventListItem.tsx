import { Box, Link, Typography } from '@mui/material';
import { ScheduleOutlined } from '@mui/icons-material';
import NextLink from 'next/link';

import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import { ZetkinEvent } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import eventMessageIds from 'features/events/l10n/messageIds';
import getEventUrl from 'features/events/utils/getEventUrl';

const PersonEventListItem = ({ event }: { event: ZetkinEvent }) => {
  const eventMessages = useMessages(eventMessageIds);
  return (
    <NextLink href={getEventUrl(event)} legacyBehavior passHref>
      <Link color="inherit" underline="none">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
          }}
        >
          <Typography>
            {event.title ||
              event.activity?.title ||
              eventMessages.common.noTitle()}
          </Typography>
          <ZUIIconLabelRow
            color="secondary"
            iconLabels={[
              {
                icon: <ScheduleOutlined color="secondary" fontSize="inherit" />,
                label: (
                  <ZUITimeSpan
                    end={new Date(removeOffset(event.start_time))}
                    start={new Date(removeOffset(event.end_time))}
                  />
                ),
              },
            ]}
            size="sm"
          />
        </Box>
      </Link>
    </NextLink>
  );
};

export default PersonEventListItem;
