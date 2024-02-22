import { FC } from 'react';
import { Box, Card, Divider, Typography, useTheme } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

interface EmailTargetsBlockedProps {
  blacklisted: number;
  missingEmail: number;
  total: number;
  unsubscribed: number;
}

const EmailTargetsBlocked: FC<EmailTargetsBlockedProps> = ({
  blacklisted,
  missingEmail,
  total,
  unsubscribed,
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
            <Msg id={messageIds.blocked.title} />
          </Typography>
          <Typography color="secondary">
            <Msg id={messageIds.blocked.subtitle} />
          </Typography>
        </Box>
        <ZUIAnimatedNumber value={total}>
          {(animatedValue) => (
            <Box
              sx={{
                backgroundColor: theme.palette.statusColors.orange,
                borderRadius: '1em',
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
      <Divider />
      <Box
        alignItems="flex-start"
        display="flex"
        justifyContent="space-between"
        padding={2}
        width="100%"
      >
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="h5">
            <Msg id={messageIds.blocked.missingEmail} />
          </Typography>
          <ZUIAnimatedNumber value={missingEmail || 0}>
            {(animatedValue) => {
              return (
                <Typography variant="h3">
                  {missingEmail > 0 ? animatedValue : '-'}
                </Typography>
              );
            }}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
      <Box
        alignItems="flex-start"
        display="flex"
        justifyContent="space-between"
        padding={2}
        width="100%"
      >
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="h5">
            <Msg id={messageIds.blocked.unsubscribed} />
          </Typography>
          <ZUIAnimatedNumber value={unsubscribed || 0}>
            {(animatedValue) => (
              <Typography variant="h3">
                {unsubscribed > 0 ? animatedValue : '-'}
              </Typography>
            )}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
      <Box
        alignItems="flex-start"
        display="flex"
        justifyContent="space-between"
        padding={2}
        width="100%"
      >
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="h5">
            <Msg id={messageIds.blocked.blacklisted} />
          </Typography>
          <ZUIAnimatedNumber value={blacklisted || 0}>
            {(animatedValue) => (
              <Typography variant="h3">
                {blacklisted > 0 ? animatedValue : '-'}
              </Typography>
            )}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
    </Card>
  );
};

export default EmailTargetsBlocked;
