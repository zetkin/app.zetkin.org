import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, CardActionArea, Link, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import { ZetkinJourney } from 'utils/types/zetkin';

import messageIds from '../l10n/messageIds';

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
                id={messageIds.journeys.openCount}
                values={{ numberOpen: stats.open }}
              />{' '}
              <Typography color="secondary" component="span">
                <Msg
                  id={messageIds.journeys.closedCount}
                  values={{ numberClosed: stats.closed }}
                />
              </Typography>
            </Typography>
            <Box mt={3}>
              <Link underline="hover" variant="button">
                <Msg id={messageIds.journeys.cardCTA} />
              </Link>
            </Box>
          </Box>
        </CardActionArea>
      </NextLink>
    </Card>
  );
};

export default JourneyCard;
