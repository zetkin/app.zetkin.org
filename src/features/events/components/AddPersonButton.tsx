import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Box, IconButton, Popover } from '@mui/material';
import { EmojiPeople, People } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import useEventParticipants from '../hooks/useEventParticipants';
import useEventParticipantsMutations from '../hooks/useEventParticipantsMutations';
import zuiMessageIds from 'zui/l10n/messageIds';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { Msg, useMessages } from 'core/i18n';
import useEvent from '../hooks/useEvent';

interface AddPersonButtonProps {
  orgId: number;
  eventId: number;
}

const AddPersonButton = ({ orgId, eventId }: AddPersonButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const event = useEvent(orgId, eventId);
  const { addParticipant } = useEventParticipantsMutations(orgId, eventId);
  const { participants, respondents } = useEventParticipants(orgId, eventId);
  const isParticipant = (personId: number): boolean => {
    return participants.some((participant) => participant.id === personId);
  };

  return (
    <>
      <IconButton
        onClick={(ev) => {
          setAnchorEl(ev.target as Element);
        }}
        sx={{ fontSize: '1rem' }}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        <Msg id={messageIds.addPerson.addButton} />
      </IconButton>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        elevation={1}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '40vh',
            maxWidth: '400px',
            width: '40vh',
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <Box mt={1} p={2}>
          {(() => {
            const getOptionExtraLabel = (personId: number) => {
              //TO DO : Add cancelled statement here when API supports it.
              if (
                participants.some((participant) => participant.id === personId)
              ) {
                return (
                  <Box
                    sx={{
                      color: '#A8A8A8',
                      display: 'flex',
                      fontSize: '0.9rem',
                    }}
                  >
                    <People sx={{ fontSize: '1.3rem', mr: 1 }} />
                    <Msg id={messageIds.addPerson.status.booked} />
                  </Box>
                );
              }
              if (
                respondents.some((respondent) => respondent.id === personId)
              ) {
                return (
                  <Box
                    sx={{
                      color: '#A8A8A8',
                      display: 'flex',
                      fontSize: '0.9rem',
                    }}
                  >
                    <EmojiPeople sx={{ fontSize: '1.3rem', mr: 1 }} />
                    <Msg id={messageIds.addPerson.status.signedUp} />
                  </Box>
                );
              }
              return '';
            };

            return (
              <ZUIPersonSelect
                bulkSelection={{
                  entityToAddTo: event?.activity?.title || undefined,
                  onSelectMultiple: (ids) => {
                    // TODO #2789: Optimize this, e.g. using RPC
                    ids.forEach((id) => {
                      if (!isParticipant(id)) {
                        addParticipant(id);
                      }
                    });
                  },
                }}
                createPersonLabels={{
                  submitLabel: zuiMessages.createPerson.submitLabel.add(),
                  title: zuiMessages.createPerson.title.participant(),
                }}
                getOptionDisabled={(option) =>
                  participants.some(
                    (participant) => participant.id == option.id
                  )
                }
                getOptionExtraLabel={(option) => {
                  return getOptionExtraLabel(option.id);
                }}
                name="person"
                onChange={(person) => {
                  addParticipant(person.id);
                }}
                placeholder={messages.addPerson.addPlaceholder()}
                selectedPerson={null}
                variant="outlined"
              />
            );
          })()}
        </Box>
      </Popover>
    </>
  );
};

export default AddPersonButton;
