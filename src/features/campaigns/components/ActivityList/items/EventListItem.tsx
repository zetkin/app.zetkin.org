import { FC } from 'react';
import {
  EventOutlined,
  Group,
  PlaceOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';

import EventWarningIcons from 'features/events/components/EventWarningIcons';
import useModel from 'core/useModel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import EventDataModel, {
  EventState,
} from 'features/events/models/EventDataModel';

interface EventListeItemProps {
  orgId: number;
  eventId: number;
}

const EventListItem: FC<EventListeItemProps> = ({ eventId, orgId }) => {
  const model = useModel((env) => new EventDataModel(env, orgId, eventId));
  const state = model.state;
  const data = model.getData().data;

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

  return (
    <ActivityListItem
      color={color}
      endNumber={`${data.num_participants_available} / ${data.num_participants_required}`}
      endNumberColor={
        data.num_participants_available < data.num_participants_required
          ? 'error'
          : undefined
      }
      href={`/organize/${orgId}/projects/${
        data.campaign?.id ?? 'standalone'
      }/events/${eventId}`}
      meta={<EventWarningIcons model={model} />}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={Group}
      subtitle={
        <ZUIIconLabelRow
          color="secondary"
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

export default EventListItem;
