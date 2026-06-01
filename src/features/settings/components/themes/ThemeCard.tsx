import { Button, Card, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ContentCopy, Delete } from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';

interface Props {
  orgId: number;
  themeId: number;
}

const ThemeCard: React.FC<Props> = ({ orgId, themeId }) => {
  const messages = useMessages(messageIds);
  const { deleteEmailTheme, duplicateEmailTheme } = useEmailTheme(
    orgId,
    themeId
  );
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h6">
          {messages.email.themes.themeCard.title({ themeId: themeId })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            href={`/organize/${orgId}/settings/email/themes/${themeId}`}
            size="small"
            variant="outlined"
          >
            {messages.email.themes.themeCard.edit()}
          </Button>
          <ZUIEllipsisMenu
            items={[
              {
                id: 'duplicateTheme',
                label: messages.email.themes.themeCard.duplicate(),
                onSelect: () => duplicateEmailTheme(),
                startIcon: <ContentCopy />,
              },
              {
                id: 'deleteTheme',
                label: messages.email.themes.delete.action(),
                onSelect: () =>
                  showConfirmDialog({
                    onSubmit: () => deleteEmailTheme(themeId),
                    submitText:
                      messages.email.themes.delete.confirmDialog.confirmButton({
                        themeId,
                      }),
                    title: messages.email.themes.delete.confirmDialog.title({
                      themeId,
                    }),
                    warningText:
                      messages.email.themes.delete.confirmDialog.warningText({
                        themeId,
                      }),
                  }),
                startIcon: <Delete />,
              },
            ]}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ThemeCard;
