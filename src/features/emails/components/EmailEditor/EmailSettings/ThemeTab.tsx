import { FC } from 'react';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';

import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmail from 'features/emails/hooks/useEmail';

const ThemeTab: FC = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const zetkinTheme = useTheme();
  const emailThemes = useEmailThemes(orgId).data || [];
  const messages = useMessages(messageIds);
  const { data, updateEmail } = useEmail(orgId, emailId);

  return (
    <Stack divider={<Divider />} sx={{ paddingTop: 1 }}>
      {emailThemes
        .sort((a, b) => {
          return a.id - b.id;
        })
        .map((emailTheme, index) => (
          <Box
            key={index}
            display="flex"
            onClick={() => updateEmail({ theme_id: emailTheme.id })}
            paddingX={1.5}
            paddingY={1.5}
            sx={{
              borderLeft:
                emailTheme.id == data?.theme?.id
                  ? `3px solid ${zetkinTheme.palette.primary.main}`
                  : '3px solid transparent',
            }}
          >
            <Typography>
              {messages.editor.settings.tabs.theme.themeTitle({
                themeId: emailTheme.id,
              })}
            </Typography>
          </Box>
        ))}
    </Stack>
  );
};

export default ThemeTab;
