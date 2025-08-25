import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { ZetkinBulkAutomation } from '../types/api';
import ZUICard from 'zui/ZUICard';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import AutomationStatusChip from './AutomationStatusChip';

type Props = {
  automation: ZetkinBulkAutomation;
};

const AutomationCard: FC<Props> = ({ automation }) => {
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
          <AutomationStatusChip automation={automation} />
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
