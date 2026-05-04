import { FC } from 'react';
import { Button, Stack, Typography } from '@mui/material';

import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmail from 'features/emails/hooks/useEmail';

const ThemeTab: FC = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const emailThemes = useEmailThemes(orgId).data || [];
  const messages = useMessages(messageIds);
  const { data, updateEmail } = useEmail(orgId, emailId);

  return (
    <Stack spacing={2} sx={{ paddingTop: 2, paddingX: 1 }}>
      {emailThemes
        .sort((a, b) => a.id - b.id)
        .map((emailTheme) => {
          const isSelected = emailTheme.id === data?.theme?.id;

          return (
            <Button
              key={emailTheme.id}
              color={isSelected ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => updateEmail({ theme_id: emailTheme.id })}
              sx={{
                justifyContent: 'flex-start',
                padding: 1.5,
              }}
              variant={isSelected ? 'contained' : 'outlined'}
            >
              <Typography variant="button">
                {messages.editor.settings.tabs.theme.themeTitle({
                  themeId: emailTheme.id,
                })}
              </Typography>
            </Button>
          );
        })}
    </Stack>
  );
};

export default ThemeTab;
