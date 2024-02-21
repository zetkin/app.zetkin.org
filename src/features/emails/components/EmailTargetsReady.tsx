import { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

interface EmailTargetsReadyProps {
  isLocked: boolean;
  isLoading: boolean;
  isTargeted: boolean;
  onToggleLocked: () => void;
}

const EmailTargetsReady: FC<EmailTargetsReadyProps> = ({
  isLocked,
  isLoading,
  isTargeted,
  onToggleLocked,
}) => {
  return (
    <Card>
      <Box
        alignItems="flex-start"
        display="flex"
        justifyContent="space-between"
        padding={2}
      >
        <Box>
          <Typography variant="h4">
            <Msg id={messageIds.ready.title} />
          </Typography>
          <Typography color="secondary">
            <Msg id={messageIds.ready.subtitle} />
          </Typography>
        </Box>
      </Box>
      {isTargeted && (
        <>
          <Divider />
          <Box
            alignItems="flex-start"
            display="flex"
            flexDirection="column"
            gap={2}
            padding={2}
          >
            <Typography>
              <Msg id={messageIds.ready.lockDescription} />
            </Typography>
            {isLoading && (
              <Button
                startIcon={<CircularProgress size="1em" />}
                variant="outlined"
              >
                <Msg id={messageIds.ready.loading} />
              </Button>
            )}
            {!isLoading && (
              <Button
                onClick={onToggleLocked}
                startIcon={isLocked ? <LockOpen /> : <Lock />}
                variant="contained"
              >
                <Msg
                  id={
                    isLocked
                      ? messageIds.ready.unlockButton
                      : messageIds.ready.lockButton
                  }
                />
              </Button>
            )}
          </Box>
        </>
      )}
    </Card>
  );
};

export default EmailTargetsReady;
