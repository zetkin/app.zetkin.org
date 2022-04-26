import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';

import PersonHoverCard from 'components/PersonHoverCard';
import TimelineActor from './TimelineActor';
import { ZetkinPerson as ZetkinPersonType } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinUpdateJourneyMilestone } from 'types/updates';

const getPersonName = (person: Partial<ZetkinPersonType>) =>
  person.first_name + ' ' + person.last_name;

interface Props {
  update: ZetkinUpdateJourneyMilestone;
}

const TimelineJourneyMilestone: React.FunctionComponent<Props> = ({
  update,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Grid alignItems="center" container direction="row" spacing={1}>
        <TimelineActor actor={update.actor} />
        {renderDescriptionText()}
      </Grid>
    </Box>
  );

  function renderDescriptionText() {
    return (
      <>
        <Typography component={Grid} item variant="body2">
          <FormattedMessage
            id={`misc.updates.${update.type}`}
            values={{
              actor: (
                <PersonHoverCard
                  BoxProps={{ style: { display: 'inline-flex' } }}
                  personId={update.actor.id}
                >
                  <b>{getPersonName(update.actor)}</b>
                </PersonHoverCard>
              ),
            }}
          />
        </Typography>
        <Typography color="textSecondary" component={Grid} item variant="body2">
          <ZetkinRelativeTime datetime={update.timestamp} />
        </Typography>
      </>
    );
  }
};

export default TimelineJourneyMilestone;
