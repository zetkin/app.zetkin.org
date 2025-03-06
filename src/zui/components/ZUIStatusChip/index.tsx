import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { getContrastColor } from 'utils/colorUtils';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import { ActivityStatus } from 'zui/types';

interface ZUIStatusChipProps {
  status: ActivityStatus;
}

const ZUIStatusChip: FC<ZUIStatusChipProps> = ({ status }) => (
  <Box
    sx={(theme) => ({
      alignItems: 'center',
      backgroundColor: theme.palette.activityStatusColors[status],
      borderRadius: '2rem',
      color: getContrastColor(theme.palette.activityStatusColors[status]),
      display: 'inline-flex',
      padding: '0.438rem 0.625rem',
    })}
  >
    <Typography variant="labelSmMedium">
      <Msg id={messageIds.statusChip[status]} />
    </Typography>
  </Box>
);

export default ZUIStatusChip;
