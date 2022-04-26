import TimelineAssigned from './updates/TimelineAssigned';
import {
  UPDATE_TYPES,
  ZetkinUpdate,
  ZetkinUpdateAssignee,
} from 'types/updates';

interface Props {
  update: ZetkinUpdate;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE) {
    return <TimelineAssigned update={update as ZetkinUpdateAssignee} />;
  } else {
    return <div />;
  }
};

export default TimelineUpdate;
