import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import { CancelOutlined, Delete, RestoreOutlined } from '@mui/icons-material';
import React, { useContext } from 'react';

import EventDataModel from '../models/EventDataModel';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIDatePicker from 'zui/ZUIDatePicker';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

interface EventActionButtonsProps {
  event: ZetkinEvent;
}

const EventActionButtons: React.FunctionComponent<EventActionButtonsProps> = ({
  event,
}) => {
  const messages = useMessages(messageIds);
  const orgId = event.organization.id;
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const router = useRouter();

  const model = useModel((env) => new EventDataModel(env, orgId, event.id));

  const published =
    !!event.published && new Date(event.published) <= new Date();

  const handlePublish = () => {
    model.setPublished(new Date().toISOString());
  };

  const handleUnpublish = () => {
    model.setPublished(null);
  };
  const handleChangeDate = (date: string | null) => {
    model.setPublished(date);
  };

  const handleDelete = () => {
    model.deleteEvent();
    router.push(`/organize/${orgId}/projects/${event.campaign?.id || ''} `);
  };

  const handleCancel = () => {
    event.cancelled ? model.restoreEvent() : model.cancel();
  };

  return (
    <Box alignItems="flex-end" display="flex" flexDirection="column" gap={1}>
      <Box>
        {published ? (
          <Button onClick={handleUnpublish} variant="outlined">
            {messages.eventActionButtons.unpublish()}
          </Button>
        ) : (
          <Button onClick={handlePublish} variant="contained">
            {messages.eventActionButtons.publish()}
          </Button>
        )}
        <ZUIEllipsisMenu
          items={[
            {
              label: (
                <>
                  {event.cancelled
                    ? messages.eventActionButtons.restore()
                    : messages.eventActionButtons.cancel()}
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleCancel,
                  title: event.cancelled
                    ? messages.eventActionButtons.restore()
                    : messages.eventActionButtons.cancel(),
                  warningText: event.cancelled
                    ? messages.eventActionButtons.warningRestore({
                        eventTitle:
                          event.title ||
                          event.activity?.title ||
                          messages.common.noTitle(),
                      })
                    : messages.eventActionButtons.warningCancel({
                        eventTitle:
                          event.title ||
                          event.activity?.title ||
                          messages.common.noTitle(),
                      }),
                });
              },

              startIcon: event.cancelled ? (
                <RestoreOutlined />
              ) : (
                <CancelOutlined />
              ),
            },
            {
              label: <>{messages.eventActionButtons.delete()}</>,
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDelete,
                  title: messages.eventActionButtons.delete(),
                  warningText: messages.eventActionButtons.warning({
                    eventTitle:
                      event.title ||
                      event.activity?.title ||
                      messages.common.noTitle(),
                  }),
                });
              },
              startIcon: <Delete />,
            },
          ]}
        />
      </Box>
      <Box>
        <ZUIDatePicker date={event.published} onChange={handleChangeDate} />
      </Box>
    </Box>
  );
};

export default EventActionButtons;
