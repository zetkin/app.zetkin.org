import TimelineAssigned from './updates/TimelineAssigned';
import TimelineJourneyMilestone from './updates/TimelineJourneyMilestone';
import TimelineJourneyStart from './updates/TimelineJourneyStart';
import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

interface Props {
  update: ZetkinUpdate;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  if (
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE ||
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE
  ) {
    return <TimelineAssigned update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE) {
    return <TimelineJourneyMilestone update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_CREATE) {
    return <TimelineJourneyStart update={update} />;
  } else {
    return <div />;
  }
};

export default TimelineUpdate;
