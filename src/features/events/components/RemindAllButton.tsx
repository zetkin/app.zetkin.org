import { FC } from 'react';
import { Check, PriorityHigh } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import { useAppSelector } from 'core/hooks';
import messageIds from 'features/events/l10n/messageIds';
import useEventParticipants from '../hooks/useEventParticipants';

interface RemindAllButtonProps {
  contactPerson?: null | { id: number; name: string };
  eventId: number;
  orgId: number;
  sendReminders: (eventId: number) => void;
  dense?: boolean;
  bold?: boolean;
}

const RemindAllButton: FC<RemindAllButtonProps> = ({
  contactPerson,
  eventId,
  orgId,
  sendReminders,
  dense = false,
  bold = false,
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
          loading={isRemindingParticipants}
          onClick={() => {
            sendReminders(eventId);
          }}
          size="small"
          startIcon={
            dense ? (
              ''
            ) : contactPerson ? (
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
            marginLeft: dense ? 0 : 2,
          }}
          variant={dense ? 'text' : 'outlined'}
        >
          <Typography variant={bold ? 'labelSmSemiBold' : 'labelMdRegular'}>
            <Msg id={messageIds.participantSummaryCard.remindButton} />
          </Typography>
        </Button>
      </Box>
    </Tooltip>
  );
};
export default RemindAllButton;
