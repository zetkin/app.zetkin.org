import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
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
  const eventId = event.id;
  const orgId = event.organization.id;
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const model = useModel((env) => new EventDataModel(env, orgId, eventId));

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
              id: '1',
              label: (
                <>
                  <Box mr={1}>
                    <Delete />
                  </Box>
                  {messages.eventActionButtons.delete()}
                </>
              ),
              onSelect: () => {
                showConfirmDialog({
                  onSubmit: handleDelete,
                  title: messages.eventActionButtons.delete(),
                  warningText: messages.eventActionButtons.warning({
                    eventTitle: event.title || event.activity.title,
                  }),
                });
              },
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
