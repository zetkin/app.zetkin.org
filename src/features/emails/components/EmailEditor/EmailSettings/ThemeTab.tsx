import { FC } from 'react';
import { Divider, Stack, Typography } from '@mui/material';

import useEmailThemes from 'features/emails/hooks/useEmailThemes';
import { useNumericRouteParams } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmail from 'features/emails/hooks/useEmail';

const ThemeTab: FC = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const themes = useEmailThemes(orgId).data || [];
  const messages = useMessages(messageIds);
  const { updateEmail } = useEmail(orgId, emailId);
  return (
    <Stack divider={<Divider />} sx={{ paddingTop: 1 }}>
      {themes.map((theme, index) => (
        <Typography
          key={index}
          onClick={() => updateEmail({ theme_id: theme.id })}
        >
          {messages.editor.settings.tabs.theme.themeTitle({
            themeId: theme.id,
          })}
        </Typography>
      ))}
    </Stack>
  );
};

export default ThemeTab;
