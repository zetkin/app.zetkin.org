import { FC } from 'react';
import { EventOutlined, People } from '@mui/icons-material';

import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import OverviewListItem from './OverviewListItem';

interface EventOverviewListItemProps {
  activity: EventActivity;
  focusDate: Date | null;
}

const EventOverviewListItem: FC<EventOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const event = activity.data;

  return (
    <OverviewListItem
      activity={activity}
      endNumber={`${event.num_participants_available} / ${event.num_participants_required}`}
      focusDate={focusDate}
      href={`/organize/${event.organization.id}/projects/${
        event.campaign?.id ?? 'standalone'
      }/events/${event.id}`}
      PrimaryIcon={EventOutlined}
      SecondaryIcon={People}
      statusBar={null}
      title={event.title || event.activity.title}
    />
  );
};

export default EventOverviewListItem;
