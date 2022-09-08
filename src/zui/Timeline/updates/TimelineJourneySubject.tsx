import { FormattedMessage } from 'react-intl';
import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceSubject } from 'zui/Timeline/updates/types';

interface TimelineJourneySubjectProps {
  update: ZetkinUpdateJourneyInstanceSubject;
}

const TimelineJourneySubject: React.FC<TimelineJourneySubjectProps> = ({
  update,
}) => (
  <UpdateContainer
    headerContent={
      <FormattedMessage
        id={`misc.updates.${update.type}`}
        values={{
          actor: <ZetkinPersonLink person={update.actor} />,
          subject: <ZetkinPersonLink person={update.details.subject} />,
        }}
      />
    }
    update={update}
  />
);

export default TimelineJourneySubject;
