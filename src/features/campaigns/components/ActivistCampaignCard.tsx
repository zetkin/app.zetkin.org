import { Card, CardContent, Link, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';

interface CampaignCardProps {
  campaign: ZetkinCampaign;
  events: ZetkinEvent[];
}

const ActivistCampaignCard = ({
  campaign,
  events,
}: CampaignCardProps): JSX.Element => {
  const numberOfUpcomingEvents = events.length;
  //TODO link to project page
  return (
    <Link href="/">
      <Card data-testid="campaign-card">
        <CardContent>
          <Typography gutterBottom noWrap variant="h6">
            {campaign.title}
          </Typography>
          <Typography color="secondary" gutterBottom variant="body2">
            <Msg
              id={messageIds.all.upcoming}
              values={{ numEvents: numberOfUpcomingEvents }}
            />
          </Typography>
          {/*TODO: labels for calls and surveys*/}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ActivistCampaignCard;
