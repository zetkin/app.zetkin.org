import { Msg } from 'core/i18n';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceConvert } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';

import messageIds from '../l10n/messageIds';

interface TimelineJourneyConvertProps {
  update: ZetkinUpdateJourneyInstanceConvert;
}

const TimelineJourneyConvert: React.FC<TimelineJourneyConvertProps> = ({
  update,
}) => {
  return (
    <UpdateContainer
      headerContent={
        <Msg
          id={messageIds.updates.journeyinstance.convert}
          values={{
            actor: <ZUIPersonLink person={update.actor} />,
            newLabel: update.details.new_journey.singular_label,
            oldLabel: update.details.old_journey.singular_label,
          }}
        />
      }
      update={update}
    />
  );
};

export default TimelineJourneyConvert;
