import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme, Typography } from '@mui/material';

import { getContrastColor } from 'utils/colorUtils';

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
  | 'draft'
  | 'expired'
  | 'published'
  | 'scheduled';

interface ZUIStatusChipProps {
  label: string;
  status: ActivityStatus;
}

const ZUIStatusChip: FC<ZUIStatusChipProps> = ({ label, status }) => {
  const classes = useStyles({ status });
  return (
    <Box className={classes.chip}>
      <Typography sx={{ fontSize: 13 }}>{label}</Typography>
    </Box>
  );
};

export default ZUIStatusChip;
