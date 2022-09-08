import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinJourneyInstanceCard from 'components/ZetkinJourneyInstanceCard';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceClose } from 'zui/Timeline/updates/types';

interface TimelineJourneyCloseProps {
  update: ZetkinUpdateJourneyInstanceClose;
}

const TimelineJourneyClose: React.FC<TimelineJourneyCloseProps> = ({
  update,
}) => {
  return (
    <UpdateContainer
      headerContent={
        <FormattedMessage
          id="misc.updates.journeyinstance.close.header"
          values={{ actor: <ZetkinPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
      <ZetkinJourneyInstanceCard
        instance={{ ...update.target, ...update.details }}
        orgId={update.organization.id}
      />
      {update.details.outcome && (
        <Typography style={{ margin: '1em 0 0 0' }}>
          {update.details.outcome}
        </Typography>
      )}
    </UpdateContainer>
  );
};

export default TimelineJourneyClose;
