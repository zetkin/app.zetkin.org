import { FormattedMessage } from 'react-intl';

import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';

interface TimelineGenericProps {
  update: ZetkinUpdate;
}

const TimelineGeneric: React.FC<TimelineGenericProps> = ({ update }) => (
  <UpdateContainer
    headerContent={
      <FormattedMessage
        id={`misc.updates.${update.type}`}
        values={{ actor: <ZUIPersonLink person={update.actor} /> }}
      />
    }
    update={update}
  />
);

export default TimelineGeneric;
