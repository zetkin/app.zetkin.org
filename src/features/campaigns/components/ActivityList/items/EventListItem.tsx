import { FC } from 'react';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import {
  EmojiPeople,
  EventOutlined,
  FaceRetouchingOff,
  Group,
  MailOutline,
  PlaceOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import EventDataModel, {
  EventState,
} from 'features/events/models/EventDataModel';

import messageIds from 'features/campaigns/l10n/messageIds';

interface EventListeItemProps {
  orgId: number;
  eventId: number;
}

const EventListItem: FC<EventListeItemProps> = ({ eventId, orgId }) => {
  const messages = useMessages(messageIds);
  const model = useModel((env) => new EventDataModel(env, orgId, eventId));
  const state = model.state;
  const data = model.getData().data;
  const participants = model.getParticipants();

  if (!data) {
    return null;
  }

  let color = STATUS_COLORS.GRAY;
  if (state === EventState.OPEN) {
    color = STATUS_COLORS.GREEN;
  } else if (state === EventState.ENDED) {
    color = STATUS_COLORS.RED;
  } else if (state === EventState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  const icons: JSX.Element[] = [
    <AlertSlot key="contact" />,
    <AlertSlot key="signups" />,
    <AlertSlot key="reminders" />,
  ];

  if (participants.data) {
    if (!data.contact) {
      icons[0] = (
        <AlertSlot
          key="contact"
          icon={<FaceRetouchingOff color="error" />}
          tooltip={messages.activityList.eventItem.contact()}
        />
      );
    }

    const numBooked = participants.data.length;
    if (data.num_participants_available > numBooked) {
      icons[1] = (
        <AlertSlot
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
        <AlertSlot
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

  return (
    <ActivityListItem
      color={color}
      endNumber={`${data.num_participants_available} / ${data.num_participants_required}`}
      href={`/organize/${orgId}/projects/${
        data.campaign?.id ?? 'standalone'
      }/events/${eventId}`}
      meta={<Box display="flex">{icons}</Box>}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={Group}
      subtitle={
        <ZUIIconLabelRow
          color="gray"
          iconLabels={[
            {
              icon: <ScheduleOutlined fontSize="inherit" />,
              label: (
                <ZUITimeSpan
                  end={new Date(data.end_time)}
                  start={new Date(data.start_time)}
                />
              ),
            },
            {
              icon: <PlaceOutlined fontSize="inherit" />,
              label: data.location.title,
            },
          ]}
          size="sm"
        />
      }
      title={data.title || data.activity.title}
    />
  );
};

const AlertSlot: FC<{
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

export default EventListItem;
