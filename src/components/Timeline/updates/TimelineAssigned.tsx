import { FormattedMessage } from 'react-intl';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateAssignee } from 'types/updates';

interface Props {
  update: ZetkinUpdateAssignee;
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
          actor: <ZetkinPersonLink person={actor} />,
          assignee: <ZetkinPersonLink person={assignee} />,
        }}
      />
    );
  }
};

export default TimelineAssigned;
