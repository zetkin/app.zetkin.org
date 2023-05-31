import { FC } from 'react';
import { Box, Paper, Popper, Typography, useTheme } from '@mui/material';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';

type SmartSearchSankeyStatsPopperProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  output: number;
};

const SmartSearchSankeyOutputPopper: FC<SmartSearchSankeyStatsPopperProps> = ({
  anchorEl,
  open,
  output,
}) => {
  const theme = useTheme();
  const light = theme.palette.grey[500];

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
            <Msg id={messageIds.statsPopper.exit} />
          </Typography>
          <Typography
            color={light}
            fontSize="40px"
            fontWeight={500}
            variant="body1"
          >
            {output}
          </Typography>
          <Typography mt={1} variant="body2">
            <Msg id={messageIds.statsPopper.details} />
          </Typography>
        </Box>
      </Paper>
    </Popper>
  );
};

export default SmartSearchSankeyOutputPopper;
