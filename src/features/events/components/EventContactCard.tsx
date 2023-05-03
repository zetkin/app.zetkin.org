import { Box, Button, Typography } from '@mui/material';
import {
  Close,
  FaceOutlined,
  FaceRetouchingOffOutlined,
} from '@mui/icons-material';
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

interface ContactDetailsProps {
  contact: { id: number; name: string };
  model: EventDataModel;
  orgId: number;
}

interface ContactSelectProps {
  model: EventDataModel;
}

const ContactDetails: FC<ContactDetailsProps> = ({ contact, model, orgId }) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  return (
    <>
      <Box m={1} sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <ZUIAvatar orgId={orgId} personId={contact.id} />
      </Box>
      <Typography sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
        {contact.name}
      </Typography>
      <Box m={1}>
        <Button
          onClick={() => {
            showConfirmDialog({
              onSubmit: () => {
                model.removeContact();
              },
              warningText: messages.eventContactCard.warningText({
                name: contact.name,
              }),
            });
          }}
          size="small"
          startIcon={<Close />}
          variant="text"
        >
          {messages.eventContactCard.removeButton()}
        </Button>
      </Box>
    </>
  );
};

const ContactSelect: FC<ContactSelectProps> = ({ model }) => {
  const messages = useMessages(messageIds);
  const handleSelectedPerson = (personId: number) => {
    model.setContact(personId);
  };

  return (
    <Box>
      <Box
        m={1}
        mb={3}
        mt={3}
        sx={{
          '& input': {
            alignSelf: 'self-start',
            minWidth: '200px !important',
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
  );
};

const EventContactCard: FC<EventContactCardProps> = ({
  data,
  model,
  orgId,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Box
      mb={2}
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
                <FaceOutlined sx={{ margin: 1, verticalAlign: 'middle' }} />
                {messages.eventContactCard.header()}
              </Box>
            ) : (
              <Box>
                <FaceRetouchingOffOutlined
                  sx={{ margin: 1, verticalAlign: 'middle' }}
                />
                {messages.eventContactCard.noContact()}
              </Box>
            )}
          </Box>
        }
        status={
          <Box>
            {data.contact ? (
              <ContactDetails
                contact={data.contact}
                model={model}
                orgId={orgId}
              />
            ) : (
              <ContactSelect model={model} />
            )}
          </Box>
        }
      >
        {''}
      </ZUICard>
    </Box>
  );
};

export default EventContactCard;
