import { FormattedMessage } from 'react-intl';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceConvert } from 'types/updates';

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
            actor: <ZetkinPersonLink person={update.actor} />,
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
