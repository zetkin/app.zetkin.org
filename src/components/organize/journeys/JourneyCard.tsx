import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, CardActionArea, Link, Typography } from '@material-ui/core';

import { ZetkinJourney } from 'types/zetkin';

interface JourneyCardProps {
  journey: ZetkinJourney;
}

const JourneyCard = ({ journey }: JourneyCardProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { id, title, stats } = journey;

  return (
    <Card data-testid="journey-card">
      <NextLink href={`/organize/${orgId}/journeys/${id}`} passHref>
        <CardActionArea>
          <Box p={1.5}>
            <Typography gutterBottom variant="h5">
              {title}
            </Typography>
            <Typography component="span">
              <Msg
                id="pages.organizeJourneys.openCount"
                values={{ numberOpen: stats.open }}
              />{' '}
              <Typography color="secondary" component="span">
                <Msg
                  id="pages.organizeJourneys.closedCount"
                  values={{ numberClosed: stats.closed }}
                />
              </Typography>
            </Typography>
            <Box mt={3}>
              <Link variant="button">
                <Msg id="pages.organizeJourneys.cardCTA" />
              </Link>
            </Box>
          </Box>
        </CardActionArea>
      </NextLink>
    </Card>
  );
};

export default JourneyCard;
