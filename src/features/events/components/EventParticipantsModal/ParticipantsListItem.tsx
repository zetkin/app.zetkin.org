import { FC } from 'react';
import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ParticipantWithPoolState } from 'features/events/types';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

type Props = {
  eventId: number;
  orgId: number;
  participant: ParticipantWithPoolState;
};

const ParticipantsListItem: FC<Props> = ({ eventId, orgId, participant }) => {
  const { moveFrom, moveTo } = useParticipantPool();
  return (
    <ListItem>
      <ListItemAvatar>
        <ZUIPersonHoverCard personId={participant.person.id}>
          <ZUIAvatar
            size={'md'}
            url={`/api/orgs/${orgId}/people/${participant.person.id}/avatar`}
          />
        </ZUIPersonHoverCard>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box>
            <Typography
              sx={{
                display: 'inline-block',
                textOverflow: 'ellipsis',
              }}
              variant="h5"
            >
              {participant.person.first_name +
                ' ' +
                participant.person.last_name}
            </Typography>
          </Box>
        }
        secondary={<SecondaryLabel participant={participant} />}
      />
      <ListItemSecondaryAction>
        {participant.status == 'booked' && (
          <Button
            onClick={() => moveFrom(eventId, participant.person.id)}
            size="small"
            variant="outlined"
          >
            <Msg
              id={messageIds.participantsModal.participantsList.buttons.move}
            />
          </Button>
        )}
        {participant.status == 'pending' && (
          <Button
            onClick={() => moveTo(eventId, participant.person.id)}
            size="small"
            variant="outlined"
          >
            <Msg
              id={messageIds.participantsModal.participantsList.buttons.addHere}
            />
          </Button>
        )}
        {participant.status == 'added' && (
          <Button
            onClick={() => moveFrom(eventId, participant.person.id)}
            size="small"
            variant="outlined"
          >
            <Msg
              id={messageIds.participantsModal.participantsList.buttons.undo}
            />
          </Button>
        )}
        {participant.status == 'removed' && (
          <Button
            onClick={() => moveTo(eventId, participant.person.id)}
            size="small"
            variant="outlined"
          >
            <Msg
              id={messageIds.participantsModal.participantsList.buttons.addBack}
            />
          </Button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const SecondaryLabel: FC<{ participant: ParticipantWithPoolState }> = ({
  participant,
}) => {
  if (participant.status == 'booked') {
    return null;
  } else {
    const msgId =
      messageIds.participantsModal.participantsList.states[participant.status];

    return <Msg id={msgId} />;
  }
};

export default ParticipantsListItem;
