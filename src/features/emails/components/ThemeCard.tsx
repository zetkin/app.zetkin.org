import { Button, Card, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ContentCopy, Delete } from '@mui/icons-material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ZUIConfirmDialog from 'zui/ZUIConfirmDialog';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

enum THEME_MENU_ITEMS {
  DUPLICATE_THEME = 'duplicateTheme',
  DELETE_THEME = 'deleteTheme',
}

interface ThemeCardProps {
  orgId: number;
  themeId: number;
}

const ThemeCard: React.FC<ThemeCardProps> = (props) => {
  const messages = useMessages(messageIds);
  const { deleteEmailTheme, duplicateEmailTheme } = useEmailTheme(
    props.orgId,
    props.themeId
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
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
            <ZUIEllipsisMenu
              items={[
                {
                  id: THEME_MENU_ITEMS.DUPLICATE_THEME,
                  label: (
                    <>
                      <ContentCopy />
                      <Msg id={messageIds.themes.themeCard.duplicate} />
                    </>
                  ),
                  onSelect: () => duplicateEmailTheme(),
                },
                {
                  id: THEME_MENU_ITEMS.DELETE_THEME,
                  label: (
                    <>
                      <Delete />
                      <Msg id={messageIds.themes.themeCard.delete} />
                    </>
                  ),
                  onSelect: () => setConfirmOpen(true),
                },
              ]}
            />
          </Stack>
        </Stack>
      </Card>
      <ZUIConfirmDialog
        onCancel={() => setConfirmOpen(false)}
        onSubmit={() => {
          deleteEmailTheme(props.themeId);
          setConfirmOpen(false);
        }}
        open={confirmOpen}
        warningText={messages.themes.themeCard.deleteWarning({
          themeId: props.themeId,
        })}
      />
    </>
  );
};

export default ThemeCard;
