import { FormattedMessage } from 'react-intl';
import { Box, Grid, Typography } from '@material-ui/core';

import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinPerson from 'components/ZetkinPerson';
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
    <Box display="flex" flexDirection="column">
      <Grid alignItems="center" container direction="row" spacing={1}>
        {update.actor && renderActorAvatar(update.actor as ZetkinPersonType)}
        {renderDescriptionText()}
      </Grid>
    </Box>
  );

  // optional "actor" (the person who made the change)
  function renderActorAvatar(actor: ZetkinPersonType) {
    return (
      <>
        <Grid item>
          <PersonHoverCard personId={actor.id}>
            <ZetkinPerson id={actor.id} name={''} showText={false} small />
          </PersonHoverCard>
        </Grid>
      </>
    );
  }

  // Forms the update description, which consists of an "action" (i.e. what the update changed),
  function renderDescriptionText() {
    return (
      <>
        <Typography component={Grid} item variant="body2">
          {renderActionText()}
        </Typography>
        <Typography color="textSecondary" component={Grid} item variant="body2">
          <ZetkinRelativeTime datetime={update.created_at} />
        </Typography>
      </>
    );
  }

  function renderActionText() {
    const assignee = update.details?.assignee;
    const actor = update?.actor;
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
    if (actor) {
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
    }
    return (
      <FormattedMessage id={`misc.updates.${update.type}`} values={values} />
    );
  }
};

export default TimelineAssigned;
