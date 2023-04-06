import { FC } from 'react';
import { EventOutlined, Group } from '@mui/icons-material';

import useModel from 'core/useModel';
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
      href={`/organize/${orgId}/projects/${
        data.campaign?.id ?? 'standalone'
      }/callassignments/${eventId}`}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={Group}
      title={data.title || data.activity.title}
    />
  );
};

export default EventListItem;
