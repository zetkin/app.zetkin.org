import { Button, Card, Stack, Typography } from '@mui/material';
import React from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ThemePreview from 'features/emails/components/ThemeEditor/ThemePreview';

interface ThemeCardProps {
  orgId: number;
  themeId: number;
}

const ThemeCard: React.FC<ThemeCardProps> = (props) => {
  const messages = useMessages(messageIds);
  const { deleteEmailTheme } = useEmailTheme(props.orgId, props.themeId);
  const { data } = useEmailTheme(props.orgId, props.themeId);

  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          {messages.themes.themeCard.title({ themeId: props.themeId })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            href={`/organize/${props.orgId}/settings/themes/${props.themeId}/frame`}
            size="small"
            variant="outlined"
          >
            {messages.themes.themeCard.edit()}
          </Button>
          <Button
            color="error"
            onClick={() => deleteEmailTheme(props.themeId)}
            size="small"
          >
            {messages.themes.themeCard.delete()}
          </Button>
        </Stack>
      </Stack>
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        <ThemePreview theme={data} />
      </Stack>
    </Card>
  );
};

export default ThemeCard;
