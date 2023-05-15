import { FC } from 'react';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import {
  EmojiPeople,
  FaceRetouchingOff,
  MailOutline,
} from '@mui/icons-material';

import EventDataModel from '../models/EventDataModel';
import messageIds from 'features/campaigns/l10n/messageIds';
import { useMessages } from 'core/i18n';

type EventWarningIconsProps = {
  compact?: boolean;
  model: EventDataModel;
};

const EventWarningIcons: FC<EventWarningIconsProps> = ({ compact, model }) => {
  const data = model.getData().data;

  if (!data) {
    return null;
  }

  const participants = model.getParticipants();
  return (
    <EventWarningIconsSansModel
      compact={compact}
      hasContact={!!data.contact}
      numParticipants={participants.data?.length ?? 0}
      numRemindersSent={
        participants.data?.filter((p) => !!p.reminder_sent).length ?? 0
      }
      numSignups={model.getPendingSignUps().length ?? 0}
      participantsLoading={!participants.data}
    />
  );
};

const EventWarningIconsSansModel: FC<{
  compact?: boolean;
  hasContact: boolean;
  numParticipants: number;
  numRemindersSent: number;
  numSignups: number;
  participantsLoading: boolean;
}> = ({
  compact,
  numParticipants,
  numRemindersSent,
  numSignups,
  hasContact,
  participantsLoading,
}) => {
  const messages = useMessages(messageIds);

  const icons: (JSX.Element | null)[] = [null, null, null];

  if (participantsLoading) {
    icons.push(<CircularProgress />);
  } else {
    if (!hasContact) {
      icons[0] = (
        <WarningSlot
          key="contact"
          icon={<FaceRetouchingOff color="error" />}
          tooltip={messages.activityList.eventItem.contact()}
        />
      );
    }

    const numBooked = numParticipants;
    if (numSignups > 0) {
      icons[1] = (
        <WarningSlot
          key="signups"
          icon={<EmojiPeople color="error" />}
          tooltip={messages.activityList.eventItem.signups()}
        />
      );
    }

    if (numRemindersSent < numBooked) {
      icons[2] = (
        <WarningSlot
          key="reminders"
          icon={<MailOutline color="error" />}
          tooltip={messages.activityList.eventItem.reminders({
            numMissing: numParticipants - numRemindersSent,
          })}
        />
      );
    }
  }

  return (
    <Box display="flex">
      {icons.map((icon, idx) => {
        if (icon) {
          return icon;
        }

        if (!compact) {
          return <WarningSlot key={idx} />;
        }
      })}
    </Box>
  );
};

export const WarningSlot: FC<{
  icon?: JSX.Element;
  tooltip?: string;
}> = ({ icon, tooltip }) => {
  return (
    <Box width="1.6em">
      {tooltip ? (
        <Tooltip arrow title={tooltip}>
          <Box display="flex">{icon}</Box>
        </Tooltip>
      ) : (
        icon
      )}
    </Box>
  );
};

export { EventWarningIconsSansModel };

export default EventWarningIcons;
