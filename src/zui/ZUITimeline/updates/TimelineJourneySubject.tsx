import { FormattedMessage } from 'react-intl';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceSubject } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';

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
          actor: <ZUIPersonLink person={update.actor} />,
          subject: <ZUIPersonLink person={update.details.subject} />,
        }}
      />
    }
    update={update}
  />
);

export default TimelineJourneySubject;
