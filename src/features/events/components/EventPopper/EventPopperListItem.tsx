import { FC } from 'react';
import { WarningSlot } from '../EventWarningIcons';
import { Box, Checkbox, Typography } from '@mui/material';
import {
  ChevronRightOutlined,
  EmojiPeople,
  FaceRetouchingOff,
  MailOutline,
  People,
} from '@mui/icons-material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import { ZetkinEvent, ZetkinEventParticipant } from 'utils/types/zetkin';

interface EventPopperListItemProps {
  compact: boolean;
  event: ZetkinEvent;
  participants: ZetkinEventParticipant[];
}

const EventPopperListItem: FC<EventPopperListItemProps> = ({
  compact,
  event,
  participants,
}) => {
  const messages = useMessages(messageIds);
  const warningIcons: (JSX.Element | null)[] = [null, null, null];
  if (!event.contact) {
    warningIcons[0] = (
      <WarningSlot
        key="contact"
        icon={<FaceRetouchingOff color="error" />}
        tooltip={messages.eventPopper.noContact()}
      />
    );
  }

  const numBooked = participants.length;
  if (event.num_participants_available > numBooked) {
    warningIcons[1] = (
      <WarningSlot
        key="signups"
        icon={<EmojiPeople color="error" />}
        tooltip={messages.eventPopper.pendingSignups()}
      />
    );
  }

  const reminded = participants.filter((p) => !!p.reminder_sent);
  const numReminded = reminded.length;
  if (numReminded < participants.length) {
    warningIcons[2] = (
      <WarningSlot
        key="reminders"
        icon={<MailOutline color="error" />}
        tooltip={messages.eventPopper.unsentReminders({
          numMissing: participants.length - numReminded,
        })}
      />
    );
  }

  return (
    <Box alignItems="center" display="flex" justifyContent="space-between">
      <Box alignItems="center" display="flex">
        <Checkbox />
        <Typography fontWeight="bold">{event.title}</Typography>
      </Box>
      <Box>
        <Box alignItems="center" display="flex">
          <Box display="flex">
            {warningIcons.map((icon, idx) => {
              if (icon) {
                return icon;
              }
              if (!compact) {
                return <WarningSlot key={idx} />;
              }
            })}
          </Box>
          <ZUIIconLabel
            color={
              event.num_participants_available < event.num_participants_required
                ? 'error'
                : 'secondary'
            }
            icon={
              <People
                color={
                  event.num_participants_available <
                  event.num_participants_required
                    ? 'error'
                    : 'secondary'
                }
              />
            }
            label={`${event.num_participants_available}/${event.num_participants_available}`}
          />
          <ChevronRightOutlined />
        </Box>
      </Box>
    </Box>
  );
};

export default EventPopperListItem;
