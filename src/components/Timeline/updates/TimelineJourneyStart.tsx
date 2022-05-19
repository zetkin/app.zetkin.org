import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';

import UpdateContainer from './elements/UpdateContainer';
import ZetkinJourneyInstanceCard from 'components/ZetkinJourneyInstanceCard';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateJourneyInstanceStart } from 'types/updates';

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
      <ZetkinJourneyInstanceCard instance={update.details.data} />
      <Typography style={{ margin: '1em 0' }}>
        {update.details.data.opening_note}
      </Typography>
    </UpdateContainer>
  );
};

export default TimelineJourneyStart;
