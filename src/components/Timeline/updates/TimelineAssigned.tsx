import { FormattedMessage } from 'react-intl';
import { Box, Grid, Typography } from '@material-ui/core';

import PersonHoverCard from 'components/PersonHoverCard';
import TimelineActor from '../TimelineActor';
import { ZetkinPerson as ZetkinPersonType } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinUpdateAssignee } from 'types/updates';

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
    const assignee = update.details.assignee;
    const actor = update.actor;
    return (
      <FormattedMessage
        id={`misc.updates.${update.type}`}
        values={{
          actor: renderPerson(actor),
          assignee: renderPerson(assignee),
        }}
      />
    );
  }

  function renderPerson(person: Partial<ZetkinPersonType>) {
    return (
      <PersonHoverCard
        BoxProps={{ style: { display: 'inline-flex' } }}
        personId={Number(person.id)}
      >
        <b>{person.first_name + ' ' + person.last_name}</b>
      </PersonHoverCard>
    );
  }
};

export default TimelineAssigned;
