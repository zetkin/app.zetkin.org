import CheckCircleIcon from '@material-ui/icons/CheckCircle';
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
    <Box>
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <TimelineActor actor={update.actor} size={32} />
        </Grid>
        <Grid
          alignItems="flex-start"
          direction="column"
          item
          spacing={3}
          style={{ paddingTop: 12 }}
        >
          {renderDescriptionText()}
          {renderContent()}
        </Grid>
      </Grid>
    </Box>
  );

  function renderDescriptionText() {
    return (
      <Grid container direction="row" item spacing={1} style={{ height: 32 }}>
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
      </Grid>
    );
  }

  function renderContent() {
    return (
      <Box>
        <CheckCircleIcon color="primary" />
      </Box>
    );
  }
};

export default TimelineJourneyMilestone;
