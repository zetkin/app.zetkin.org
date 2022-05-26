import { AccessTime } from '@material-ui/icons';
import NextLink from 'next/link';
import { Grid, Link, Typography } from '@material-ui/core';

import JourneyStatusChip from './journeys/JourneyStatusChip';
import ZetkinDate from './ZetkinDate';
import { ZetkinJourneyInstance } from 'types/zetkin';

export interface ZetkinJourneyInstanceItemProps {
  instance:
    | ZetkinJourneyInstance
    | Pick<ZetkinJourneyInstance, 'closed' | 'title' | 'journey' | 'id'>;
  orgId: number | string;
}

const ZetkinJourneyInstanceItem: React.FC<ZetkinJourneyInstanceItemProps> = ({
  instance,
  orgId,
}) => {
  const isOpen = !instance.closed;
  const hasMeta = 'next_milestone' in instance;

  return (
    <Grid alignItems="center" container justifyContent="space-between">
      <Grid item>
        <Typography
          color={isOpen ? 'textPrimary' : 'textSecondary'}
          data-testid="page-title"
          noWrap
          style={{ display: 'flex' }}
          variant="h5"
        >
          <NextLink
            href={`/organize/${orgId}/journeys/${instance.journey.id}/${instance.id}`}
            passHref
          >
            <Link color="inherit">
              {instance.title || instance.journey.title}
            </Link>
          </NextLink>
          <Typography
            color="textSecondary"
            variant="h5"
          >{`#${instance.id}`}</Typography>
        </Typography>
      </Grid>
      <Grid item>
        <JourneyStatusChip instance={instance} />
      </Grid>
      {isOpen && hasMeta && (
        <>
          <Grid item sm={12}>
            <Typography variant="body2">{instance.journey.title}</Typography>
          </Grid>
          {instance.next_milestone && (
            <Grid container item sm={12} style={{ marginTop: 8 }}>
              <Typography
                color="inherit"
                style={{ display: 'flex' }}
                variant="body2"
              >
                <AccessTime
                  color="inherit"
                  style={{ height: '1em', marginRight: 4 }}
                />
                {instance.next_milestone.title}
                {instance.next_milestone.deadline && ': '}
                {instance.next_milestone.deadline && (
                  <ZetkinDate datetime={instance.next_milestone.deadline} />
                )}
              </Typography>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default ZetkinJourneyInstanceItem;
