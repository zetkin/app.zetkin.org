import { FC } from 'react';
import { Box, Card, Divider, Typography, useTheme } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import ZUINumberChip from 'zui/ZUINumberChip';

interface EmailTargetsBlockedProps {
  blacklisted: number | null;
  missingEmail: number | null;
  total: number | null;
  unsubscribed: number | null;
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
        {total != null && (
          <ZUIAnimatedNumber value={total}>
            {(animatedValue) => (
              <ZUINumberChip
                color={theme.palette.statusColors.orange}
                size="lg"
                value={animatedValue}
              />
            )}
          </ZUIAnimatedNumber>
        )}
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
              const output = missingEmail != null ? animatedValue : '-';
              return <Typography variant="h3">{output}</Typography>;
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
            {(animatedValue) => {
              const output = unsubscribed != null ? animatedValue : '-';
              return <Typography variant="h3">{output}</Typography>;
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
            <Msg id={messageIds.blocked.blacklisted} />
          </Typography>
          <ZUIAnimatedNumber value={blacklisted || 0}>
            {(animatedValue) => {
              const output = blacklisted != null ? animatedValue : '-';
              return <Typography variant="h3">{output}</Typography>;
            }}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
    </Card>
  );
};

export default EmailTargetsBlocked;
