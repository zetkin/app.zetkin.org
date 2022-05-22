import { Grid, Typography } from '@material-ui/core';

import JourneyStatusChip from './journeys/JourneyStatusChip';
import { ZetkinJourneyInstance } from 'types/zetkin';

export interface ZetkinJourneyInstanceItemProps {
  instance: Pick<ZetkinJourneyInstance, 'closed' | 'title' | 'journey' | 'id'>;
}

const ZetkinJourneyInstanceItem: React.FC<ZetkinJourneyInstanceItemProps> = ({
  instance,
}) => {
  return (
    <Grid container justifyContent="space-between">
      <Grid item>
        <Typography
          component="div"
          data-testid="page-title"
          noWrap
          style={{ display: 'flex' }}
          variant="h5"
        >
          {instance.title || instance.journey.title}
          <Typography
            color="textSecondary"
            variant="h5"
          >{`#${instance.id}`}</Typography>
        </Typography>
      </Grid>
      <Grid item>
        <JourneyStatusChip instance={instance} />
      </Grid>
    </Grid>
  );
};

export default ZetkinJourneyInstanceItem;
