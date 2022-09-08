import { FormattedMessage } from 'react-intl';

import Markdown from 'components/Markdown';
import UpdateContainer from './elements/UpdateContainer';
import ZetkinJourneyInstanceCard from 'components/ZetkinJourneyInstanceCard';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceStart } from 'zui/Timeline/updates/types';

interface TimelineJourneyStartProps {
  update: ZetkinUpdateJourneyInstanceStart;
}

const TimelineJourneyStart: React.FC<TimelineJourneyStartProps> = ({
  update,
}) => {
  return (
    <UpdateContainer
      headerContent={
        <FormattedMessage
          id="misc.updates.journeyinstance.create.header"
          values={{ actor: <ZetkinPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
      <ZetkinJourneyInstanceCard
        instance={update.details.data}
        orgId={update.organization.id}
      />
      <Markdown
        BoxProps={{ margin: '1rem 0' }}
        markdown={update.details.data.opening_note}
      />
    </UpdateContainer>
  );
};

export default TimelineJourneyStart;
