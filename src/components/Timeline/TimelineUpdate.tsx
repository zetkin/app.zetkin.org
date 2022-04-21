import { FormattedMessage } from 'react-intl';
import { Box, Grid, Typography } from '@material-ui/core';

import ZetkinPerson from '../ZetkinPerson';
import ZetkinRelativeTime from '../ZetkinRelativeTime';
import { ZetkinPerson as ZetkinPersonType, ZetkinUpdate } from 'types/zetkin';

const PersonName: React.FunctionComponent<{
  person: Partial<ZetkinPersonType>;
}> = ({ person }) => {
  return (
    <Typography component={Grid} item variant="subtitle2">
      {person.first_name + ' ' + person.last_name}
    </Typography>
  );
};

interface Props {
  update: ZetkinUpdate;
}

const TimelineUpdate: React.FunctionComponent<Props> = ({ update }) => {
  return (
    <Box display="flex" flexDirection="column">
      {getDescription()}
      {getContent()}
    </Box>
  );

  function getDescription() {
    const Action = () => (
      <>
        <Typography component={Grid} item variant="body2">
          <FormattedMessage id={`misc.updates.${update.type}`} />
        </Typography>
        {update.data?.assignee && <PersonName person={update.data.assignee} />}
        <Typography color="textSecondary" component={Grid} item variant="body2">
          <ZetkinRelativeTime datetime={update.created_at} />
        </Typography>
      </>
    );
    return (
      <Grid alignItems="center" container direction="row" spacing={1}>
        {update.actor && (
          <>
            <Grid item>
              <ZetkinPerson
                id={update.actor.id}
                name={''}
                showText={false}
                small
              />
            </Grid>
            <Grid item>
              <PersonName person={update.actor} />
            </Grid>
          </>
        )}
        <Action />
      </Grid>
    );
  }

  function getContent() {
    const noContent = ['journey.assignee.add'].includes(update.type);
    return noContent ? null : <Box />;
  }
};

export default TimelineUpdate;
