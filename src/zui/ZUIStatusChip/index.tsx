import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme, Typography } from '@mui/material';

import { getContrastColor } from 'utils/colorUtils';
import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

const useStyles = makeStyles<Theme, { status: ActivityStatus }>((theme) => ({
  chip: {
    alignItems: 'center',
    backgroundColor: ({ status }) => theme.palette.activityStatusColors[status],
    borderRadius: '2em',
    color: ({ status }) =>
      getContrastColor(theme.palette.activityStatusColors[status]),
    display: 'inline-flex',
    padding: '0.438rem 0.625rem',
  },
}));

type ActivityStatus =
  | 'cancelled'
  | 'closed'
  | 'draft'
  | 'ended'
  | 'published'
  | 'scheduled';

interface ZUIStatusChipProps {
  status: ActivityStatus;
}

const ZUIStatusChip: FC<ZUIStatusChipProps> = ({ status }) => {
  const classes = useStyles({ status });
  return (
    <Box className={classes.chip}>
      <Typography sx={{ fontSize: 13 }}>
        <Msg id={messageIds.statusChip[status]} />
      </Typography>
    </Box>
  );
};

export default ZUIStatusChip;
