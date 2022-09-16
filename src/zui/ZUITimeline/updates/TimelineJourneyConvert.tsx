import { FormattedMessage } from 'react-intl';

import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceConvert } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';

interface TimelineJourneyConvertProps {
  update: ZetkinUpdateJourneyInstanceConvert;
}

const TimelineJourneyConvert: React.FC<TimelineJourneyConvertProps> = ({
  update,
}) => {
  return (
    <UpdateContainer
      headerContent={
        <FormattedMessage
          id="misc.updates.journeyinstance.convert"
          values={{
            actor: <ZUIPersonLink person={update.actor} />,
            newLabel: update.details.new_journey.singular_label,
            oldLabel: update.details.old_journey.singular_label,
          }}
        />
      }
      update={update}
    ></UpdateContainer>
  );
};

export default TimelineJourneyConvert;
