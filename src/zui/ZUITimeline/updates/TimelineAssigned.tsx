import { Msg } from 'core/i18n';
import UpdateContainer from './elements/UpdateContainer';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import {
  UPDATE_TYPES,
  ZetkinUpdateJourneyInstanceAssignee,
} from 'zui/ZUITimeline/types';
import messageIds from '../l10n/messageIds';

interface Props {
  update: ZetkinUpdateJourneyInstanceAssignee;
}

const TimelineAssigned: React.FunctionComponent<Props> = ({ update }) => {
  return <UpdateContainer headerContent={renderActionText()} update={update} />;

  function renderActionText() {
    const assignee = update.details.assignee;
    const actor = update.actor;
    return (
      <Msg
        id={
          messageIds.updates.journeyinstance[
            update.type == UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE
              ? 'addassignee'
              : 'removeassignee'
          ]
        }
        values={{
          actor: <ZUIPersonLink person={actor} />,
          assignee: <ZUIPersonLink person={assignee} />,
        }}
      />
    );
  }
};

export default TimelineAssigned;
