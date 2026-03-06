import React, { FC, useState } from 'react';
import { Check, PriorityHigh } from '@mui/icons-material';
import { Box, Button, CircularProgress, Tooltip } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import { useAppSelector } from 'core/hooks';
import messageIds from 'features/events/l10n/messageIds';
import useEventParticipants from '../hooks/useEventParticipants';
import ZUIConfirmDialog from 'zui/ZUIConfirmDialog';

interface RemindAllButtonProps {
  contactPerson?: null | { id: number; name: string };
  eventId: number;
  orgId: number;
  sendReminders: (eventId: number) => void;
}

const RemindAllButton: FC<RemindAllButtonProps> = ({
  contactPerson,
  eventId,
  orgId,
  sendReminders,
}) => {
  const isRemindingParticipants = useAppSelector(
    (state) => state.events.remindingByEventId[eventId]
  );

  const { numAvailParticipants, numRemindedParticipants } =
    useEventParticipants(orgId, eventId);

  const messages = useMessages(messageIds);
  const [isConfirmReminderOpen, setIsConfirmReminderOpen] = useState(false);

  function handleConfirm() {
    sendReminders(eventId);
    setIsConfirmReminderOpen(false);
  }

  return (
    <Tooltip
      arrow
      placement="top-start"
      title={
        contactPerson == null
          ? messages.participantSummaryCard.remindButtondisabledTooltip()
          : ''
      }
    >
      <Box>
        <Button
          disabled={
            contactPerson == null ||
            isRemindingParticipants ||
            numRemindedParticipants >= numAvailParticipants
          }
          onClick={() => {
            setIsConfirmReminderOpen(true);
          }}
          size="small"
          startIcon={
            contactPerson ? (
              isRemindingParticipants ? (
                <CircularProgress size={20} />
              ) : (
                <Check />
              )
            ) : (
              <PriorityHigh />
            )
          }
          sx={{
            marginLeft: 2,
          }}
          variant="outlined"
        >
          <Msg id={messageIds.participantSummaryCard.remindButton} />
        </Button>

        <ZUIConfirmDialog
          onCancel={() => setIsConfirmReminderOpen(false)}
          onSubmit={handleConfirm}
          open={isConfirmReminderOpen}
          title={messages.eventPopper.confirmRemindersTitle()}
          warningText={messages.eventPopper.confirmRemindersMessage({
            numReminders: numAvailParticipants - numRemindedParticipants,
          })}
        />
      </Box>
    </Tooltip>
  );
};
export default RemindAllButton;
