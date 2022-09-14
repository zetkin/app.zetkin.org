import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';

import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceClose } from 'zui/ZUITimeline/types';
import ZUIJourneyInstanceCard from 'zui/ZUIJourneyInstanceCard';
import ZUIPersonLink from 'zui/ZUIPersonLink';

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
          values={{ actor: <ZUIPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    >
      <ZUIJourneyInstanceCard
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
