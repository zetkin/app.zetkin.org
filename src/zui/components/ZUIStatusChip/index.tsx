import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme, Typography } from '@mui/material';

import { getContrastColor } from 'utils/colorUtils';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import { ActivityStatus } from 'zui/types';

const useStyles = makeStyles<Theme, { status: ActivityStatus }>((theme) => ({
  chip: {
    alignItems: 'center',
    backgroundColor: ({ status }) => theme.palette.activityStatusColors[status],
    borderRadius: '2rem',
    color: ({ status }) =>
      getContrastColor(theme.palette.activityStatusColors[status]),
    display: 'inline-flex',
    padding: '0.438rem 0.625rem',
  },
}));

interface ZUIStatusChipProps {
  status: ActivityStatus;
}

const ZUIStatusChip: FC<ZUIStatusChipProps> = ({ status }) => {
  const classes = useStyles({ status });
  return (
    <Box className={classes.chip}>
      <Typography variant="labelSmMedium">
        <Msg id={messageIds.statusChip[status]} />
      </Typography>
    </Box>
  );
};

export default ZUIStatusChip;
