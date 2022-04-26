import { FormattedMessage } from 'react-intl';
import { Box, Grid, Typography } from '@material-ui/core';

import PersonHoverCard from 'components/PersonHoverCard';
import TimelineActor from './TimelineActor';
import { ZetkinPerson as ZetkinPersonType } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinUpdateAssignee } from 'types/updates';

const getPersonName = (person: Partial<ZetkinPersonType>) =>
  person.first_name + ' ' + person.last_name;

interface Props {
  update: ZetkinUpdateAssignee;
}

const TimelineAssigned: React.FunctionComponent<Props> = ({ update }) => {
  return (
    <Box>
      <Grid alignItems="center" container direction="row" spacing={2}>
        <Grid item>
          <TimelineActor actor={update.actor} size={32} />
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={1}>
            {renderDescriptionText()}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  // Forms the update description, which consists of an "action" (i.e. what the update changed),
  function renderDescriptionText() {
    return (
      <>
        <Typography component={Grid} item variant="body2">
          {renderActionText()}
        </Typography>
        <Typography color="textSecondary" component={Grid} item variant="body2">
          <ZetkinRelativeTime datetime={update.timestamp} />
        </Typography>
      </>
    );
  }

  function renderActionText() {
    const assignee = update.details?.assignee;
    const actor = update.actor;
    let values = {};
    if (assignee) {
      values = {
        ...values,
        assignee: (
          <PersonHoverCard
            BoxProps={{ style: { display: 'inline-flex' } }}
            personId={assignee.id}
          >
            <b>{getPersonName(assignee)}</b>
          </PersonHoverCard>
        ),
      };
    }
    values = {
      ...values,
      actor: (
        <PersonHoverCard
          BoxProps={{ style: { display: 'inline-flex' } }}
          personId={actor.id}
        >
          <b>{getPersonName(actor)}</b>
        </PersonHoverCard>
      ),
    };
    return (
      <FormattedMessage id={`misc.updates.${update.type}`} values={values} />
    );
  }
};

export default TimelineAssigned;
