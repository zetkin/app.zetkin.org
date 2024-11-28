import { FC } from 'react';
import { Box, Card, Divider, Typography, useTheme } from '@mui/material';

import { EmailState } from '../hooks/useEmailState';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

interface EmailTargetsReadyProps {
  lockedReadyTargets: number | null;
  missingEmail: number;
  readyTargets: number;
  state: EmailState;
}

const EmailTargetsReady: FC<EmailTargetsReadyProps> = ({
  lockedReadyTargets,
  missingEmail,
  readyTargets,
  state,
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
          <ZUIAnimatedNumber
            value={
              lockedReadyTargets === null ? readyTargets : lockedReadyTargets
            }
          >
            {(animatedValue) => (
              <Box
                sx={{
                  backgroundColor:
                    parseInt(animatedValue) > 0
                      ? theme.palette.statusColors.green
                      : theme.palette.statusColors.gray,
                  borderRadius: '1em',
                  color:
                    parseInt(animatedValue) > 0
                      ? 'white'
                      : theme.palette.text.secondary,
                  display: 'flex',
                  flexShrink: 0,
                  fontSize: '1.8em',
                  lineHeight: 'normal',
                  marginRight: '0.1em',
                  overflow: 'hidden',
                  padding: '0.2em 0.7em',
                }}
              >
                {parseInt(animatedValue) > 0 ? animatedValue : 0}
              </Box>
            )}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
      {missingEmail > 0 && state != EmailState.SENT && (
        <>
          <Divider />
          <Box padding={2}>
            <Typography>
              <Msg
                id={messageIds.ready.missingEmailsDescription}
                values={{ numPeople: missingEmail }}
              />
            </Typography>
          </Box>
        </>
      )}
    </Card>
  );
};

export default EmailTargetsReady;
