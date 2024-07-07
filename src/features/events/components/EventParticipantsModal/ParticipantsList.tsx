import { FC } from 'react';
import { List } from '@mui/material';

import ParticipantsListItem from './ParticipantsListItem';
import { ParticipantWithPoolState } from 'features/events/types';

type Props = {
  eventId: number;
  orgId: number;
  participants: ParticipantWithPoolState[];
};

const ParticipantsList: FC<Props> = ({ eventId, orgId, participants }) => {
  return (
    <List>
      {participants.map((participant) => (
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
