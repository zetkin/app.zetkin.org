import TimelineAssigned from './updates/TimelineAssigned';
import TimelineJourneyClose from './updates/TimelineJourneyClose';
import TimelineJourneyInstance from './updates/TimelineJourneyInstance';
import TimelineJourneyMilestone from './updates/TimelineJourneyMilestone';
import TimelineJourneyStart from './updates/TimelineJourneyStart';
import TimelineNoteAdded from './updates/TimelineNoteAdded';
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
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE) {
    return <TimelineNoteAdded update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_CLOSE) {
    return <TimelineJourneyClose update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATE) {
    return <TimelineJourneyInstance update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE) {
    return <TimelineJourneyMilestone update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_CREATE) {
    return <TimelineJourneyStart update={update} />;
  } else {
    return <div />;
  }
};

export default TimelineUpdate;
