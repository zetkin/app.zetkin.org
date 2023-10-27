import { FormattedDate } from 'react-intl';
import NextLink from 'next/link';
import {
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { removeOffset } from 'utils/dateUtils';
import useCampaignEvents from '../hooks/useCampaignEvents';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';

interface CampaignCardProps {
  campaign: ZetkinCampaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { id, title } = campaign;
  const { firstEvent, lastEvent, numberOfUpcomingEvents } = useCampaignEvents(
    orgId,
    id
  );

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
            <Msg id={messageIds.indefinite} />
          )}
        </Typography>
        <Typography color="secondary" gutterBottom variant="body2">
          <Msg
            id={messageIds.all.upcoming}
            values={{ numEvents: numberOfUpcomingEvents }}
          />
        </Typography>
        {/*TODO: labels for calls and surveys*/}
      </CardContent>
      <CardActions sx={{ paddingBottom: 2, paddingLeft: 2 }}>
        <NextLink href={`/organize/${orgId}/projects/${id}`} passHref>
          <Link underline="hover" variant="button">
            <Msg id={messageIds.all.cardCTA} />
          </Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default CampaignCard;
