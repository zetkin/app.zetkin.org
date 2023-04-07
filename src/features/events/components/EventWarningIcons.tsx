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
  model: EventDataModel;
};

const EventWarningIcons: FC<EventWarningIconsProps> = ({ model }) => {
  const messages = useMessages(messageIds);
  const data = model.getData().data;

  if (!data) {
    return null;
  }

  const participants = model.getParticipants();

  const icons: JSX.Element[] = [
    <WarningSlot key="contact" />,
    <WarningSlot key="signups" />,
    <WarningSlot key="reminders" />,
  ];

  if (participants.data) {
    if (!data.contact) {
      icons[0] = (
        <WarningSlot
          key="contact"
          icon={<FaceRetouchingOff color="error" />}
          tooltip={messages.activityList.eventItem.contact()}
        />
      );
    }

    const numBooked = participants.data.length;
    if (data.num_participants_available > numBooked) {
      icons[1] = (
        <WarningSlot
          key="signups"
          icon={<EmojiPeople color="error" />}
          tooltip={messages.activityList.eventItem.signups()}
        />
      );
    }

    const reminded = participants.data.filter((p) => !!p.reminder_sent);
    const numReminded = reminded.length;
    if (numReminded < participants.data.length) {
      icons[2] = (
        <WarningSlot
          key="reminders"
          icon={<MailOutline color="error" />}
          tooltip={messages.activityList.eventItem.reminders({
            numMissing: participants.data.length - numReminded,
          })}
        />
      );
    }
  } else {
    icons.push(<CircularProgress />);
  }

  return <Box display="flex">{icons}</Box>;
};

const WarningSlot: FC<{
  icon?: JSX.Element;
  tooltip?: string;
}> = ({ icon, tooltip }) => {
  return (
    <Box width="1.6em">
      {tooltip ? (
        <Tooltip arrow title={tooltip}>
          <Box>{icon}</Box>
        </Tooltip>
      ) : (
        icon
      )}
    </Box>
  );
};

export default EventWarningIcons;
