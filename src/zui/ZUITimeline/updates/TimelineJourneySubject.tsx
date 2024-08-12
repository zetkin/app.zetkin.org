import { Msg } from 'core/i18n';
import UpdateContainer from './elements/UpdateContainer';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import {
  UPDATE_TYPES,
  ZetkinUpdateJourneyInstanceSubject,
} from 'zui/ZUITimeline/types';
import messageIds from '../l10n/messageIds';

interface TimelineJourneySubjectProps {
  update: ZetkinUpdateJourneyInstanceSubject;
}

const TimelineJourneySubject: React.FC<TimelineJourneySubjectProps> = ({
  update,
}) => (
  <UpdateContainer
    headerContent={
      <Msg
        id={
          messageIds.updates.journeyinstance[
            update.type == UPDATE_TYPES.JOURNEYINSTANCE_ADDSUBJECT
              ? 'addsubject'
              : 'removesubject'
          ]
        }
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
