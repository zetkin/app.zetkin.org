import { useRouter } from 'next/router';
import { Button, Card, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ContentCopy, Delete } from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import { ZetkinJourney } from 'utils/types/zetkin';
import messageIds from 'features/settings/l10n/messageIds';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

interface JourneySettingsCardProps {
  journey: ZetkinJourney;
}

const JourneySettingsCard = ({
  journey,
}: JourneySettingsCardProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { id, title } = journey;
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h6">{title}</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            href={`/organize/${orgId}/settings/journeys/${id}`}
            size="small"
            variant="outlined"
          >
            {messages.journeys.card.edit()}
          </Button>
          <ZUIEllipsisMenu
            items={[
              {
                id: 'duplicateJourney',
                label: messages.journeys.card.duplicate(),
                // onSelect: () => duplicateEmailTheme(),
                startIcon: <ContentCopy />,
              },
              {
                id: 'deleteJourney',
                label: messages.journeys.delete.action(),
                onSelect: () =>
                  showConfirmDialog({
                    // onSubmit: () => deleteEmailTheme(journey),
                    submitText:
                      messages.journeys.delete.confirmDialog.confirmButton({
                        title,
                      }),
                    title: messages.journeys.delete.confirmDialog.title({
                      title,
                    }),
                    warningText:
                      messages.journeys.delete.confirmDialog.warningText({
                        title,
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

export default JourneySettingsCard;
