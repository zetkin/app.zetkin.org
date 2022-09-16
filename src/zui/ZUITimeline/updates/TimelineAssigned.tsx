import { FormattedMessage } from 'react-intl';

import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceAssignee } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';

interface Props {
  update: ZetkinUpdateJourneyInstanceAssignee;
}

const TimelineAssigned: React.FunctionComponent<Props> = ({ update }) => {
  return <UpdateContainer headerContent={renderActionText()} update={update} />;

  function renderActionText() {
    const assignee = update.details.assignee;
    const actor = update.actor;
    return (
      <FormattedMessage
        id={`misc.updates.${update.type}`}
        values={{
          actor: <ZUIPersonLink person={actor} />,
          assignee: <ZUIPersonLink person={assignee} />,
        }}
      />
    );
  }
};

export default TimelineAssigned;
