import { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import ZUINumberChip from 'zui/ZUINumberChip';

interface EmailTargetsReadyProps {
  isLocked: boolean;
  isLoading: boolean;
  isTargeted: boolean;
  onToggleLocked: () => void;
  readyTargets: number | null;
}

const EmailTargetsReady: FC<EmailTargetsReadyProps> = ({
  isLocked,
  isLoading,
  isTargeted,
  onToggleLocked,
  readyTargets,
}) => {
  const theme = useTheme();
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
        <Box alignItems="center" display="flex" gap={2}>
          {isLocked && (
            <Box
              bgcolor={theme.palette.grey[300]}
              borderRadius="2em"
              padding={1}
            >
              <Typography variant="body2">
                <Msg id={messageIds.ready.locked} />
              </Typography>
            </Box>
          )}
          {readyTargets != null && (
            <ZUIAnimatedNumber value={readyTargets}>
              {(animatedValue) => (
                <ZUINumberChip
                  color={theme.palette.statusColors.green}
                  size="lg"
                  value={animatedValue}
                />
              )}
            </ZUIAnimatedNumber>
          )}
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
              <Msg
                id={
                  isLocked
                    ? messageIds.ready.unlockDescription
                    : messageIds.ready.lockDescription
                }
              />
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
