import TimelineAssigned from './updates/TimelineAssigned';
import TimelineJourneyInstance from './updates/TimelineJourneyInstance';
import TimelineJourneyMilestone from './updates/TimelineJourneyMilestone';
import TimelineJourneyStart from './updates/TimelineJourneyStart';
import TimelineJourneySubject from './updates/TimelineJourneySubject';
import TimelineNoteAdded from './updates/TimelineNoteAdded';
import TimelineTags from './updates/TimelineTags';
import { ZetkinUpdateTags } from '../../types/updates';
import { UPDATE_TYPES, ZetkinUpdate } from 'types/updates';

interface Props {
  update: ZetkinUpdate;
}

// Type predicate function that checks if the action (second part) of update type
// matches any of the supplied types, and if so returns true indicating that
// the update is of type T.
function isWildcardType<T extends ZetkinUpdate>(
  update: ZetkinUpdate,
  types: Array<T['type']>
): update is T {
  const updateAction = update.type.split('.')[1];
  for (const type of types) {
    const typeAction = type.split('.')[1];
    if (typeAction == updateAction) {
      return true;
    }
  }

  return false;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  if (
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE ||
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_REMOVEASSIGNEE
  ) {
    return <TimelineAssigned update={update} />;
  } else if (
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDSUBJECT ||
    update.type === UPDATE_TYPES.JOURNEYINSTANCE_REMOVESUBJECT
  ) {
    return <TimelineJourneySubject update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE) {
    return <TimelineNoteAdded update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATE) {
    return <TimelineJourneyInstance update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE) {
    return <TimelineJourneyMilestone update={update} />;
  } else if (update.type === UPDATE_TYPES.JOURNEYINSTANCE_CREATE) {
    return <TimelineJourneyStart update={update} />;
  } else if (
    isWildcardType<ZetkinUpdateTags>(update, [
      UPDATE_TYPES.ANY_ADDTAGS,
      UPDATE_TYPES.ANY_REMOVETAGS,
    ])
  ) {
    return <TimelineTags update={update} />;
  } else {
    return <div />;
  }
};

export default TimelineUpdate;
