import { Box, Button } from '@mui/material';
import { Check } from '@mui/icons-material';
import { forwardRef } from 'react';

import UnverifiedSignupsSection from 'features/events/components/UnverifiedSignupsSection';
import { Msg, useMessages } from 'core/i18n';
import ParticipantListSection from 'features/events/components/ParticipantListSection';
import messageIds from 'features/events/l10n/messageIds';
import oldTheme from 'theme';
import { ZetkinEvent } from 'utils/types/zetkin';
import useEventParticipants from '../hooks/useEventParticipants';
import useEventParticipantsMutations from '../hooks/useEventParticipantsMutations';
import useParticipantStatus from '../hooks/useParticipantsStatus';

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
    numSignedUpParticipants,
    respondentsFuture,
    unverifiedSignedUpParticipants,
    verifiedSignedUpParticipants,
  } = useEventParticipants(orgId, data.id);
  const { addParticipant } = useEventParticipantsMutations(orgId, data.id);
  const participantStatus = useParticipantStatus(orgId, data.id);
  const respondents = respondentsFuture.data;

  return (
    <Box ref={ref}>
      {unverifiedSignedUpParticipants.length > 0 && (
        <UnverifiedSignupsSection
          chipColor={oldTheme.palette.grey[500]}
          chipNumber={unverifiedSignedUpParticipants.length.toString()}
          description={messages.eventParticipantsList.descriptionUnverifiedSignups()}
          eventId={data.id}
          filterString={filterString}
          orgId={orgId}
          rows={unverifiedSignedUpParticipants}
          title={messages.eventParticipantsList.unverifiedSignups()}
        />
      )}
      {numSignedUpParticipants > 0 && (
        <ParticipantListSection
          chipColor={oldTheme.palette.grey[500]}
          chipNumber={numSignedUpParticipants.toString()}
          description={messages.eventParticipantsList.descriptionSignups()}
          eventId={data.id}
          filterString={filterString}
          headerActions={
            <Button
              onClick={() => {
                respondents?.map((r) => {
                  if (!bookedParticipants.some((p) => p.id === r.person.id)) {
                    addParticipant(r.person.id);
                  }
                });
              }}
              size="small"
              startIcon={<Check />}
              sx={{ marginLeft: 2 }}
              variant="outlined"
            >
              <Msg id={messageIds.participantSummaryCard.bookButton} />
            </Button>
          }
          orgId={orgId}
          rows={verifiedSignedUpParticipants ?? []}
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
          chipColor={oldTheme.palette.grey[500]}
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
