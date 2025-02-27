import { FC } from 'react';
import { Check, PriorityHigh } from '@mui/icons-material';
import { Box, Button, CircularProgress, Tooltip } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import { useAppSelector } from 'core/hooks';
import messageIds from 'features/events/l10n/messageIds';
import useEventParticipants from '../hooks/useEventParticipants';

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
            sendReminders(eventId);
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
      </Box>
    </Tooltip>
  );
};
export default RemindAllButton;
