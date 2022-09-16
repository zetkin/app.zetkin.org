import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import { getFirstAndLastEvent, removeOffset } from 'utils/dateUtils';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';

interface CampaignCardProps {
  campaign: ZetkinCampaign;
  events: ZetkinEvent[];
}

const CampaignCard = ({ campaign, events }: CampaignCardProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { id, title } = campaign;

  const campaignEvents = events.filter(
    (event) => event.campaign.id === campaign.id
  );
  const numOfUpcomingEvents = campaignEvents.filter((event) =>
    dayjs(removeOffset(event.end_time)).isAfter(dayjs())
  ).length;

  const [firstEvent, lastEvent] = getFirstAndLastEvent(campaignEvents);

  return (
    <Card data-testid="campaign-card">
      <CardContent>
        <Typography gutterBottom noWrap variant="h6">
          {title}
        </Typography>
        <Typography gutterBottom variant="body2">
          {firstEvent && lastEvent ? (
            <>
              <FormattedDate
                day="numeric"
                month="long"
                value={removeOffset(firstEvent.start_time)}
              />{' '}
              {' - '}
              <FormattedDate
                day="numeric"
                month="long"
                value={removeOffset(lastEvent.end_time)}
              />
            </>
          ) : (
            <Msg id="pages.organizeAllCampaigns.indefinite" />
          )}
        </Typography>
        <Typography color="secondary" gutterBottom variant="body2">
          <Msg
            id="pages.organizeAllCampaigns.upcoming"
            values={{ numEvents: numOfUpcomingEvents }}
          />
        </Typography>
        {/*TODO: labels for calls and surveys*/}
      </CardContent>
      <CardActions>
        <NextLink href={`/organize/${orgId}/campaigns/${id}`} passHref>
          <Link variant="button">
            <Msg id="pages.organizeAllCampaigns.cardCTA" />
          </Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default CampaignCard;
