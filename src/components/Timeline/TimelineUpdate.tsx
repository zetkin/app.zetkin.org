import TimelineAssigned from './updates/TimelineAssigned';
import TimelineJourneyMilestone from './updates/TimelineJourneyMilestone';
import {
  UPDATE_TYPES,
  ZetkinUpdate,
  ZetkinUpdateAssignee,
  ZetkinUpdateJourneyMilestone,
} from 'types/updates';

interface Props {
  update: ZetkinUpdate;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE) {
    return <TimelineAssigned update={update as ZetkinUpdateAssignee} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE) {
    return (
      <TimelineJourneyMilestone
        update={update as ZetkinUpdateJourneyMilestone}
      />
    );
  } else {
    return <div />;
  }
};

export default TimelineUpdate;
