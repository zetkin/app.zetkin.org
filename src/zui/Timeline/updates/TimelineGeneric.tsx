import { FormattedMessage } from 'react-intl';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdate } from 'zui/Timeline/updates/types';

interface TimelineGenericProps {
  update: ZetkinUpdate;
}

const TimelineGeneric: React.FC<TimelineGenericProps> = ({ update }) => (
  <UpdateContainer
    headerContent={
      <FormattedMessage
        id={`misc.updates.${update.type}`}
        values={{ actor: <ZetkinPersonLink person={update.actor} /> }}
      />
    }
    update={update}
  />
);

export default TimelineGeneric;
