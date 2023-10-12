import { Box, Button, Typography } from '@mui/material';
import {
  Close,
  FaceOutlined,
  FaceRetouchingOffOutlined,
} from '@mui/icons-material';
import { FC, useContext } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import useEventData from '../hooks/useEventData';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
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
        <ZUIPersonHoverCard personId={contact.id}>
          <ZUIPersonAvatar orgId={orgId} personId={contact.id} />
        </ZUIPersonHoverCard>
      </Box>
      <Typography sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
        {contact.name}
      </Typography>
      <Box mb={1}>
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
    <Box m={1} mb={5} mt={3}>
      <ZUIPersonSelect
        onChange={(person) => {
          handleSelectedPerson(person.id);
        }}
        placeholder={messages.eventContactCard.selectPlaceholder()}
        selectedPerson={null}
        variant="outlined"
      />
    </Box>
  );
};

const EventContactCard: FC<EventContactCardProps> = ({ data, orgId }) => {
  const messages = useMessages(messageIds);
  const eventFuture = useEventData(orgId, data.id);

  return (
    <Box mb={2}>
      <ZUICard
        header={
          <Box>
            {eventFuture.data?.contact?.id ? (
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
      >
        {data.contact ? (
          <ContactDetails contact={data.contact} model={model} orgId={orgId} />
        ) : (
          <ContactSelect model={model} />
        )}
      </ZUICard>
    </Box>
  );
};

export default EventContactCard;
