import TimelineAssigned from './updates/TimelineAssigned';
import TimelineJourneyMilestone from './updates/TimelineJourneyMilestone';
import TimelineJourneyStart from './updates/TimelineJourneyStart';
import {
  UPDATE_TYPES,
  ZetkinUpdate,
  ZetkinUpdateAssignee,
  ZetkinUpdateJourneyMilestone,
  ZetkinUpdateJourneyStart,
} from 'types/updates';

interface Props {
  update: ZetkinUpdate;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  if (
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE ||
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE
  ) {
    return <TimelineAssigned update={update as ZetkinUpdateAssignee} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE) {
    return (
      <TimelineJourneyMilestone
        update={update as ZetkinUpdateJourneyMilestone}
      />
    );
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_CREATE) {
    return <TimelineJourneyStart update={update as ZetkinUpdateJourneyStart} />;
  } else {
    return <div />;
  }
};

export default TimelineUpdate;
