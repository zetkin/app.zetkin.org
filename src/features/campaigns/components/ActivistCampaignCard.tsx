import { FormattedDate } from 'react-in tl';
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

const ActivistCampaignCard = ({ campaign }: CampaignCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { id, title } = campaign;
  const { firstEvent, lastEvent, numberOfUpcomingEvents } = useCampaignEvents(
    orgId,
    id
  );
  //TODO link to project page
  return (
    <Link href="/">
      <Card data-testid="campaign-card">
        <CardContent>
          <Typography gutterBottom noWrap variant="h6">
            {title}
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
