import { AccessTime } from '@material-ui/icons';
import NextLink from 'next/link';
import { Box, Grid, Link, Typography } from '@material-ui/core';

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
    <NextLink
      href={`/organize/${orgId}/journeys/${instance.journey.id}/${instance.id}`}
    >
      <Grid container direction="column" style={{ cursor: 'pointer' }}>
        <Grid item>
          <Box
            alignItems="center"
            display="flex"
            flexWrap="wrap-reverse"
            justifyContent="space-between"
            style={{ gap: 5 }}
          >
            <Typography
              color={isOpen ? 'textPrimary' : 'textSecondary'}
              component="span"
              data-testid="page-title"
              variant="h5"
            >
              <Link color="inherit">
                {instance.title || instance.journey.title}
              </Link>
              <Typography color="textSecondary" component="span" variant="h5">
                {' '}
                {`#${instance.id}`}
              </Typography>
            </Typography>
            <JourneyStatusChip instance={instance} />
          </Box>
        </Grid>
        {isOpen && hasMeta && (
          <>
            <Grid item>
              <Typography variant="body2">{instance.journey.title}</Typography>
            </Grid>
            {instance.next_milestone && (
              <Grid container item>
                <Typography
                  color="inherit"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    marginTop: 8,
                  }}
                  variant="body2"
                >
                  <AccessTime color="inherit" style={{ marginRight: 4 }} />
                  {instance.next_milestone.title}
                  {instance.next_milestone.deadline && (
                    <>
                      {': '}
                      <ZetkinDate datetime={instance.next_milestone.deadline} />
                    </>
                  )}
                </Typography>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </NextLink>
  );
};

export default ZetkinJourneyInstanceItem;
