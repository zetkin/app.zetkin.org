import { Button, Card, Stack, Typography } from '@mui/material';
import React from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import ThemeActionsEllipsisMenu from 'features/emails/components/ThemeActionsEllipsisMenu';

interface ThemeCardProps {
  orgId: number;
  themeId: number;
}

const ThemeCard: React.FC<ThemeCardProps> = (props) => {
  const messages = useMessages(messageIds);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h6">
          {messages.themes.themeCard.title({ themeId: props.themeId })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            href={`/organize/${props.orgId}/settings/themes/${props.themeId}`}
            size="small"
            variant="outlined"
          >
            {messages.themes.themeCard.edit()}
          </Button>
          <ThemeActionsEllipsisMenu
            orgId={props.orgId}
            themeId={props.themeId}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ThemeCard;
