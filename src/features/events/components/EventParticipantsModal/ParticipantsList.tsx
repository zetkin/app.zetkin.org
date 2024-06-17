import { FC } from 'react';
import { List } from '@mui/material';

import ParticipantsListItem from './ParticipantsListItem';
import useEventParticipantsWithChanges from 'features/events/hooks/useEventParticipantsWithChanges';

type Props = {
  eventId: number;
  orgId: number;
};

const ParticipantsList: FC<Props> = ({ eventId, orgId }) => {
  const { bookedParticipants } = useEventParticipantsWithChanges(
    orgId,
    eventId
  );

  return (
    <List>
      {bookedParticipants.map((participant) => (
        <ParticipantsListItem
          key={participant.person.id}
          eventId={eventId}
          orgId={orgId}
          participant={participant}
        />
      ))}
    </List>
  );
};

export default ParticipantsList;
