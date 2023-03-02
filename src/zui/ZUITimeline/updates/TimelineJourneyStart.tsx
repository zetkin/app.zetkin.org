import { Msg } from 'core/i18n';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceStart } from 'zui/ZUITimeline/types';
import ZUIJourneyInstanceCard from 'zui/ZUIJourneyInstanceCard';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUIPersonLink from 'zui/ZUIPersonLink';

import messageIds from '../l10n/messageIds';

interface TimelineJourneyStartProps {
  update: ZetkinUpdateJourneyInstanceStart;
}

const TimelineJourneyStart: React.FC<TimelineJourneyStartProps> = ({
  update,
}) => {
  return (
    <UpdateContainer
      headerContent={
        <Msg
          id={messageIds.updates.journeyinstance.create.header}
          values={{ actor: <ZUIPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
      <ZUIJourneyInstanceCard
        instance={update.details.data}
        orgId={update.organization.id}
      />
      <ZUIMarkdown
        BoxProps={{ margin: '1rem 0' }}
        markdown={update.details.data.opening_note}
      />
    </UpdateContainer>
  );
};

export default TimelineJourneyStart;
