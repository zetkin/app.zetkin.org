import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FlagIcon from '@material-ui/icons/Flag';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';

import PersonHoverCard from 'components/PersonHoverCard';
import theme from 'theme';
import TimelineActor from '../TimelineActor';
import { ZetkinPerson as ZetkinPersonType } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import {
  CHANGE_PROPS,
  UPDATE_TYPES,
  ZetkinUpdateJourneyMilestone,
} from 'types/updates';

const getPersonName = (person: Partial<ZetkinPersonType>) =>
  person.first_name + ' ' + person.last_name;

interface Props {
  update: ZetkinUpdateJourneyMilestone;
}

const TimelineJourneyMilestone: React.FunctionComponent<Props> = ({
  update,
}) => {
  let changeToRender: 'complete' | 'incomplete' | 'deadline';

  const changeProp = Object.keys(
    update.details.changes
  )[0] as CHANGE_PROPS[UPDATE_TYPES.JOURNEYINSTANCE_UPDATEMILESTONE];

  if (changeProp === 'completed') {
    changeToRender = !update.details.changes[changeProp]?.to
      ? 'incomplete'
      : 'complete';
  } else if (changeProp === 'deadline') {
    changeToRender = 'deadline';
  }

  return (
    <Box>
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <TimelineActor actor={update.actor} size={32} />
        </Grid>
        <Grid item style={{ paddingTop: 12 }}>
          <Grid
            alignItems="flex-start"
            container
            direction="column"
            spacing={2}
          >
            {renderDescriptionText()}
            {renderContent()}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  function renderDescriptionText() {
    return (
      <Grid container direction="row" item spacing={1}>
        <Typography component={Grid} item variant="body2">
          <FormattedMessage
            id={`misc.updates.${update.type}.${changeToRender}`}
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
      <Grid alignItems="center" container direction="row" item spacing={2}>
        {changeToRender === 'complete' && (
          <CheckCircleIcon style={{ color: theme.palette.success.main }} />
        )}
        {changeToRender === 'incomplete' && (
          <CancelIcon style={{ color: theme.palette.warning.main }} />
        )}
        <Typography component={Grid} item variant="h6">
          {update.details.milestone.title}
        </Typography>
        {changeToRender === 'deadline' && (
          <FlagIcon
            style={{
              color: theme.palette.text.secondary,
              marginLeft: theme.spacing(2),
            }}
          />
        )}
        {changeToRender === 'deadline' && (
          <Typography
            color="textSecondary"
            component={Grid}
            item
            variant="body2"
          >
            now due{' '}
            <ZetkinRelativeTime
              datetime={update.details.changes.deadline?.to as string}
            />
          </Typography>
        )}
      </Grid>
    );
  }
};

export default TimelineJourneyMilestone;
