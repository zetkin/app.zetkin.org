import CloseIcon from '@mui/icons-material/Close';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import FaceRetouchingOffOutlinedIcon from '@mui/icons-material/FaceRetouchingOffOutlined';
import { Box, Button, Typography } from '@mui/material';
import { FC, useContext } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUICard from 'zui/ZUICard';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';

interface EventContactCardProps {
  data: ZetkinEvent;
  model: EventDataModel;
  orgId: number;
}

const EventContactCard: FC<EventContactCardProps> = ({
  data,
  model,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const handleSelectedPerson = (personId: number) => {
    model.setContact(personId);
  };

  return (
    <Box
      sx={{
        '& div': {
          flexDirection: 'column',
          flexWrap: 'wrap',
        },
        display: 'block',
      }}
    >
      <ZUICard
        header={
          <Box>
            {model.getData().data?.contact?.id ? (
              <Box>
                <FaceOutlinedIcon sx={{ margin: 1, verticalAlign: 'middle' }} />
                {messages.eventContactCard.header()}
              </Box>
            ) : (
              <Box>
                <FaceRetouchingOffOutlinedIcon
                  sx={{ margin: 1, verticalAlign: 'middle' }}
                />
                {messages.eventContactCard.noContact()}
              </Box>
            )}
          </Box>
        }
        status={
          <Box>
            {data.contact?.id ? (
              <>
                <Box
                  m={1}
                  sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                >
                  <ZUIAvatar orgId={orgId} personId={data.contact.id} />
                </Box>
                <Typography
                  sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                >
                  {data.contact.name}
                </Typography>
              </>
            ) : (
              <Box sx={{ display: 'grid' }}>
                <Box
                  m={1}
                  sx={{
                    '& input': {
                      alignSelf: 'self-start',
                      minWidth: '100px !important',
                      width: '200px !important',
                    },
                  }}
                >
                  <ZUIPersonSelect
                    onChange={(person) => {
                      handleSelectedPerson(person.id);
                    }}
                    placeholder={messages.eventContactCard.selectPlaceholder()}
                    selectedPerson={null}
                    variant="outlined"
                  />
                </Box>
              </Box>
            )}
          </Box>
        }
      >
        {data.contact && (
          <Button
            onClick={() => {
              showConfirmDialog({
                onSubmit: () => {
                  model.removeContact();
                },
                warningText: messages.eventContactCard.warningText(),
              });
            }}
            variant="text"
          >
            <CloseIcon />
            {messages.eventContactCard.removeButton()}
          </Button>
        )}
      </ZUICard>
    </Box>
  );
};

export default EventContactCard;
