import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import {
  ArrowForward,
  CancelOutlined,
  ContentCopy,
  Delete,
  RestoreOutlined,
} from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';

import messageIds from '../l10n/messageIds';
import useDuplicateEvent from '../hooks/useDuplicateEvent';
import useEventMutations from '../hooks/useEventMutations';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIDatePicker from 'zui/ZUIDatePicker';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ChangeCampaignDialog from '../../campaigns/components/ChangeCampaignDialog';

interface EventActionButtonsProps {
  event: ZetkinEvent;
}

const EventActionButtons: React.FunctionComponent<EventActionButtonsProps> = ({
  event,
}) => {
  const messages = useMessages(messageIds);
  const orgId = event.organization.id;
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { cancelEvent, updateEvent, deleteEvent, restoreEvent, setPublished } =
    useEventMutations(orgId, event.id);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const router = useRouter();
  const duplicateEvent = useDuplicateEvent(orgId, event.id);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const published =
    !!event.published && new Date(event.published) <= new Date();
  const handlePublish = () => {
    setPublished(new Date().toISOString());
  };

  const handleUnpublish = () => {
    setPublished(null);
  };
  const handleChangeDate = (date: string | null) => {
    const newDateIsDifferent =
      date && date != dayjs(event.published).format('YYYY-MM-DD');

    if (newDateIsDifferent) {
      setPublished(date);
    }

    if (!date) {
      setPublished(null);
    }
  };

  const handleDelete = () => {
    deleteEvent();
    router.push(`/organize/${orgId}/projects/${event.campaign?.id || ''} `);
  };

  const handleDuplicate = () => {
    duplicateEvent();
  };

  const handleCancel = () => {
    event.cancelled ? restoreEvent() : cancelEvent();
  };

  const handleMove = () => {
    setIsMoveDialogOpen(true);
  };

  const handleOnCampaignSelected = async (campaignId: number) => {
    await updateEvent({ campaign_id: campaignId });
    await router.push(
      `/organize/${orgId}/projects/${campaignId}/events/${event.id}`
    );
    showSnackbar(
      'success',
      messages.eventChangeCampaignDialog.success({
        campaignTitle: event.campaign!.title,
        eventTitle: event.title!,
      })
    );
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
              label: event.cancelled
                ? messages.eventActionButtons.restore()
                : messages.eventActionButtons.cancel(),
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
              label: <>{messages.eventActionButtons.duplicate()}</>,
              onSelect: handleDuplicate,
              startIcon: <ContentCopy />,
            },
            {
              label: <>{messages.eventActionButtons.move()}</>,
              onSelect: handleMove,
              startIcon: <ArrowForward />,
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
      <ChangeCampaignDialog
        errorMessage={messages.eventChangeCampaignDialog.error()}
        onCampaignSelected={handleOnCampaignSelected}
        onClose={() => setIsMoveDialogOpen(false)}
        open={isMoveDialogOpen}
        title={messages.eventChangeCampaignDialog.title()}
      />
    </Box>
  );
};

export default EventActionButtons;
