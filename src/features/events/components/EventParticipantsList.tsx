import { Box } from '@mui/material';
import { forwardRef } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import ParticipantListSection from 'features/events/components/ParticipantListSection';
import theme from 'theme';
import useEventParticipantsData from '../hooks/useEventParticipantsData';
import { useMessages } from 'core/i18n';
import useParticipantStatus from '../hooks/useParticipantsStatus';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventParticipantsListProps {
  data: ZetkinEvent;
  filterString: string;
  orgId: number;
}

const EventParticipantsList = forwardRef(function EventParticipantsList(
  { data, filterString, orgId }: EventParticipantsListProps,
  ref
) {
  const messages = useMessages(messageIds);
  const {
    bookedParticipants,
    cancelledParticipants,
    numAvailParticipants,
    numCancelledParticipants,
    numSignedParticipants,
    pendingSignUps,
  } = useEventParticipantsData(orgId, data.id);
  const participantStatus = useParticipantStatus(orgId, data.id);

  return (
    <Box ref={ref}>
      {numSignedParticipants > 0 && (
        <ParticipantListSection
          chipColor={theme.palette.grey[500]}
          chipNumber={numSignedParticipants.toString()}
          description={messages.eventParticipantsList.descriptionSignups()}
          eventId={data.id}
          filterString={filterString}
          orgId={orgId}
          rows={pendingSignUps ?? []}
          title={messages.eventParticipantsList.signUps()}
          type="signups"
        />
      )}
      <ParticipantListSection
        chipColor={participantStatus}
        chipNumber={numAvailParticipants + '/' + data.num_participants_required}
        description={messages.eventParticipantsList.descriptionBooked()}
        eventId={data.id}
        filterString={filterString}
        orgId={orgId}
        rows={bookedParticipants}
        title={messages.eventParticipantsList.bookedParticipants()}
        type="booked"
      />
      {numCancelledParticipants > 0 && (
        <ParticipantListSection
          chipColor={theme.palette.grey[500]}
          chipNumber={numCancelledParticipants.toString()}
          description={messages.eventParticipantsList.descriptionCancelled()}
          eventId={data.id}
          filterString={filterString}
          orgId={orgId}
          rows={cancelledParticipants}
          title={messages.eventParticipantsList.cancelledParticipants()}
          type="cancelled"
        />
      )}
    </Box>
  );
});

export default EventParticipantsList;
