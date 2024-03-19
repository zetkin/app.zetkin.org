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

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

interface EmailTargetsReadyProps {
  isLocked: boolean;
  isLoading: boolean;
  isTargeted: boolean;
  lockedReadyTargets: number | null;
  onToggleLocked: () => void;
  readyTargets: number;
  state: EmailState;
}

const EmailTargetsReady: FC<EmailTargetsReadyProps> = ({
  isLocked,
  isLoading,
  isTargeted,
  lockedReadyTargets,
  onToggleLocked,
  readyTargets,
  state,
}) => {
  const theme = useTheme();
  const showUnlockInfo = isTargeted && state != EmailState.SENT;

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
            <Msg
              id={
                state === EmailState.SENT
                  ? messageIds.ready.sentSubtitle
                  : messageIds.ready.subtitle
              }
            />
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
          <ZUIAnimatedNumber
            value={
              lockedReadyTargets === null ? readyTargets : lockedReadyTargets
            }
          >
            {(animatedValue) => (
              <Box
                sx={{
                  backgroundColor: theme.palette.statusColors.green,
                  borderRadius: '1em',
                  color: 'white',
                  display: 'flex',
                  flexShrink: 0,
                  fontSize: '1.8em',
                  lineHeight: 'normal',
                  marginRight: '0.1em',
                  overflow: 'hidden',
                  padding: parseInt(animatedValue) === 0 ? '' : '0.2em 0.7em',
                }}
              >
                {parseInt(animatedValue) > 0 ? animatedValue : ''}
              </Box>
            )}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
      {showUnlockInfo && (
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
              {state === EmailState.SCHEDULED ? (
                <Msg id={messageIds.ready.scheduledDescription} />
              ) : (
                <Msg
                  id={
                    isLocked
                      ? messageIds.ready.unlockDescription
                      : messageIds.ready.lockDescription
                  }
                />
              )}
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
                disabled={state === EmailState.SCHEDULED}
                onClick={onToggleLocked}
                startIcon={isLocked ? <LockOpen /> : <Lock />}
                variant={isLocked ? 'outlined' : 'contained'}
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
