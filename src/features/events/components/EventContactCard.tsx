import { Box, Button, Typography } from '@mui/material';
import {
  Close,
  FaceOutlined,
  FaceRetouchingOffOutlined,
} from '@mui/icons-material';
import { FC, useContext } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import useEvent from '../hooks/useEvent';
import useEventContact from '../hooks/useEventContact';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import zuiMessageIds from 'zui/l10n/messageIds';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';

interface EventContactCardProps {
  data: ZetkinEvent;
  orgId: number;
}

interface ContactDetailsProps {
  contact: { id: number; name: string };

  eventId: number;
  orgId: number;
}

interface ContactSelectProps {
  orgId: number;

  eventId: number;
}

const ContactDetails: FC<ContactDetailsProps> = ({
  contact,
  eventId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { removeContact } = useEventContact(orgId, eventId);

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
                removeContact();
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

const ContactSelect: FC<ContactSelectProps> = ({ orgId, eventId }) => {
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);

  const { setContact } = useEventContact(orgId, eventId);
  const handleSelectedPerson = (personId: number) => {
    setContact(personId);
  };

  return (
    <Box m={1} mb={5} mt={3}>
      <ZUIPersonSelect
        onChange={(person) => handleSelectedPerson(person.id)}
        placeholder={messages.eventContactCard.selectPlaceholder()}
        selectedPerson={null}
        submitLabel={zuiMessages.createPerson.submitLabel.assign()}
        title={zuiMessages.createPerson.title.contact()}
        variant="outlined"
      />
    </Box>
  );
};

const EventContactCard: FC<EventContactCardProps> = ({ data, orgId }) => {
  const messages = useMessages(messageIds);
  const eventFuture = useEvent(orgId, data.id);

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
          <ContactDetails
            contact={data.contact}
            eventId={data.id}
            orgId={orgId}
          />
        ) : (
          <ContactSelect eventId={data.id} orgId={orgId} />
        )}
      </ZUICard>
    </Box>
  );
};

export default EventContactCard;
