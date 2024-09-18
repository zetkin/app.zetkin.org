import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { Box, Divider, Paper, Typography } from '@mui/material';

import { ZetkinArea } from '../types';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  area: ZetkinArea;
  onClose: () => void;
};

const AreaPlanningOverlay: FC<Props> = ({ area, onClose }) => {
  const messages = useMessages(messageIds);

  return (
    <Paper
      sx={{
        bottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 400,
        padding: 2,
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 1000,
      }}
    >
      <Box padding={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">
            {area.title || messages.empty.title()}
          </Typography>
          <Close
            color="secondary"
            onClick={() => {
              onClose();
            }}
            sx={{
              cursor: 'pointer',
            }}
          />
        </Box>
        <Box paddingTop={1}>
          <Typography
            color="secondary"
            fontStyle={area.description?.trim().length ? 'inherit' : 'italic'}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {area.description?.trim().length
              ? area.description
              : messages.empty.description()}
          </Typography>
        </Box>
      </Box>
      <Divider />
    </Paper>
  );
};

export default AreaPlanningOverlay;
