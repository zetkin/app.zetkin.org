import { FC } from 'react';
import { Box, Chip, Typography } from '@mui/material';

import { ZetkinBulkAutomation } from '../types/api';
import ZUICard from 'zui/ZUICard';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

type Props = {
  automation: ZetkinBulkAutomation;
};

const AutomationCard: FC<Props> = ({ automation }) => {
  const messages = useMessages(messageIds);

  return (
    <ZUICard header={automation.title}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            height: '4em',
          }}
        >
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {automation.description}
          </Typography>
          <Typography color="secondary" variant="body2">
            <Msg
              id={messageIds.labels.schedule.interval}
              values={{ seconds: automation.interval }}
            />
          </Typography>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Chip
            color={automation.active ? 'success' : 'secondary'}
            label={
              automation.active
                ? messages.labels.status.active()
                : messages.labels.status.inactive()
            }
            size="small"
          />
          <Typography color="secondary" variant="body2">
            {!automation.last_run && (
              <Msg id={messageIds.labels.lastRun.never} />
            )}
            {automation.last_run && (
              <Msg
                id={messageIds.labels.lastRun.relative}
                values={{
                  relative: <ZUIRelativeTime datetime={automation.last_run} />,
                }}
              />
            )}
          </Typography>
        </Box>
      </Box>
    </ZUICard>
  );
};

export default AutomationCard;
