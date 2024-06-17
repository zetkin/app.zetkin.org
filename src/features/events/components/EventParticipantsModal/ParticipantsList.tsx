import { FC } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { Msg } from 'core/i18n';
import useEventParticipants from 'features/events/hooks/useEventParticipants';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

type Props = {
  eventId: number;
  orgId: number;
};

const ParticipantsList: FC<Props> = ({ eventId, orgId }) => {
  const { bookedParticipants } = useEventParticipants(orgId, eventId);
  const { moveFrom } = useParticipantPool();

  return (
    <List>
      {bookedParticipants.map((person) => (
        <ListItem key={person.id}>
          <ListItemAvatar>
            <ZUIPersonHoverCard personId={person.id}>
              <ZUIAvatar
                size={'md'}
                url={`/api/orgs/${orgId}/people/${person.id}/avatar`}
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
                  {person.first_name + ' ' + person.last_name}
                </Typography>
              </Box>
            }
            secondary={
              <>
                <Typography
                  gutterBottom
                  sx={{ display: 'inline', textOverflow: 'ellipsis' }}
                  variant="body2"
                >
                  {person.email || ''}
                </Typography>{' '}
                <Typography
                  gutterBottom
                  sx={{ display: 'inline', textOverflow: 'ellipsis' }}
                  variant="body2"
                >
                  {person.phone || ''}
                </Typography>
              </>
            }
          />
          <ListItemSecondaryAction>
            <Button
              onClick={() => moveFrom(eventId, person.id)}
              size="small"
              variant="outlined"
            >
              <Msg
                id={messageIds.participantsModal.participantsList.moveButton}
              />
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ParticipantsList;
