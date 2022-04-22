import { FormattedMessage } from 'react-intl';
import { Box, Grid, Typography } from '@material-ui/core';

import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinPerson as ZetkinPersonType, ZetkinUpdate } from 'types/zetkin';

const getPersonName = (person: Partial<ZetkinPersonType>) =>
  person.first_name + ' ' + person.last_name;

interface Props {
  update: ZetkinUpdate;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Grid alignItems="center" container direction="row" spacing={1}>
        {update.actor && renderActorAvatar(update.actor as ZetkinPersonType)}
        {renderDescriptionText()}
      </Grid>
      {getContent()}
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

  // Displays the content of the update, if the type of update includes content
  function getContent() {
    const noContent = ['journey.assignee.add'].includes(update.type);
    return noContent ? null : <Box />;
  }
};

export default TimelineUpdate;
