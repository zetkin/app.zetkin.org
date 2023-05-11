import { Box } from '@mui/material';
import { forwardRef } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import ParticipantListSection from 'features/events/components/ParticipantListSection';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventParticipantsListProps {
  data: ZetkinEvent;
  filterString: string;
  model: EventDataModel;
  orgId: number;
}

const EventParticipantsList = forwardRef(function EventParticipantsList(
  { data, filterString, model, orgId }: EventParticipantsListProps,
  ref
) {
  const messages = useMessages(messageIds);

  return (
    <Box ref={ref}>
      {model.getNumSignedParticipants() > 0 && (
        <ParticipantListSection
          chipColor={theme.palette.grey[500]}
          chipNumber={model.getNumSignedParticipants().toString()}
          description={messages.eventParticipantsList.descriptionSignups()}
          filterString={filterString}
          model={model}
          orgId={orgId}
          rows={model.getPendingSignUps() ?? []}
          title={messages.eventParticipantsList.signUps()}
          type="signups"
        />
      )}
      <ParticipantListSection
        chipColor={model.getParticipantStatus()}
        chipNumber={
          model.getNumAvailParticipants() + '/' + data.num_participants_required
        }
        description={messages.eventParticipantsList.descriptionBooked()}
        filterString={filterString}
        model={model}
        orgId={orgId}
        rows={model.getBookedParticipants()}
        title={messages.eventParticipantsList.bookedParticipants()}
        type="booked"
      />
      {model.getNumCancelledParticipants() > 0 && (
        <ParticipantListSection
          chipColor={theme.palette.grey[500]}
          chipNumber={model.getNumCancelledParticipants().toString()}
          description={messages.eventParticipantsList.descriptionCancelled()}
          filterString={filterString}
          model={model}
          orgId={orgId}
          rows={model.getCancelledParticipants()}
          title={messages.eventParticipantsList.cancelledParticipants()}
          type="cancelled"
        />
      )}
    </Box>
  );
});

export default EventParticipantsList;
