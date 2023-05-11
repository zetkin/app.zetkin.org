import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Box, IconButton, Popover } from '@mui/material';
import { EmojiPeople, People } from '@mui/icons-material';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from '../l10n/messageIds';
import ZUIFutures from 'zui/ZUIFutures';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { Msg, useMessages } from 'core/i18n';

interface AddPersonButtonProps {
  model: EventDataModel;
}

const AddPersonButton = ({ model }: AddPersonButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const messages = useMessages(messageIds);

  const handleSelectedPerson = (personId: number) => {
    model.addParticipant(personId);
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
          <ZUIFutures
            futures={{
              participants: model.getParticipants(),
              respondents: model.getRespondents(),
            }}
          >
            {({ data: { participants, respondents } }) => {
              const getOptionExtraLabel = (personId: number) => {
                //TO DO : Add cancelled statement here when API supports it.
                if (
                  participants.some(
                    (participant) => participant.id === personId
                  )
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
                <>
                  <ZUIPersonSelect
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
                      handleSelectedPerson(person.id);
                    }}
                    placeholder={messages.addPerson.addPlaceholder()}
                    selectedPerson={null}
                    variant="outlined"
                  />
                </>
              );
            }}
          </ZUIFutures>
        </Box>
      </Popover>
    </>
  );
};

export default AddPersonButton;
