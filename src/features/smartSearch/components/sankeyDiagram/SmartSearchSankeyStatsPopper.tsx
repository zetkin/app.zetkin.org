import { FC } from 'react';
import { Box, Grid, Paper, Popper, Typography, useTheme } from '@mui/material';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { SankeySegmentStats } from './types';
import { Msg, useMessages } from 'core/i18n';

type SmartSearchSankeyStatsPopperProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  stats: SankeySegmentStats;
};

const SmartSearchSankeyStatsPopper: FC<SmartSearchSankeyStatsPopperProps> = ({
  anchorEl,
  open,
  stats,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const light = theme.palette.grey[500];
  const dark = theme.palette.text.primary;

  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
      placement="left"
      sx={{ zIndex: 2000 }}
    >
      <Paper elevation={2} sx={{ transform: 'translate(-20px, 0)' }}>
        <Box maxWidth={300} p={2}>
          <Typography fontWeight={500} variant="h5">
            <Msg id={messageIds.statsPopper.headline} />
          </Typography>
          <Grid container>
            <Grid item sm={6}>
              <Metric
                color={light}
                label={messages.statsPopper.matches()}
                value={stats.matches}
              />
            </Grid>
            <Grid item sm={6}>
              <Metric
                color={dark}
                label="CHANGE"
                value={stats.change > 0 ? `+${stats.change}` : stats.change}
              />
            </Grid>
            <Grid item sm={6}>
              <Metric
                color={light}
                label={messages.statsPopper.input()}
                value={stats.input}
              />
            </Grid>
            <Grid item sm={6}>
              <Metric
                color={light}
                label={messages.statsPopper.output()}
                value={stats.output}
              />
            </Grid>
          </Grid>
          <Typography mt={1} variant="body2">
            <Msg id={messageIds.statsPopper.info} />
          </Typography>
        </Box>
      </Paper>
    </Popper>
  );
};

const Metric: FC<{ color?: string; label: string; value: number | string }> = ({
  color,
  label,
  value,
}) => {
  return (
    <Box display="flex" flexDirection="column" mt={2}>
      <Typography fontSize="12px" variant="body2">
        {label.toUpperCase()}
      </Typography>
      <Typography
        color={color}
        fontSize="20px"
        fontWeight={500}
        variant="body1"
      >
        {value}
      </Typography>
    </Box>
  );
};

export default SmartSearchSankeyStatsPopper;
