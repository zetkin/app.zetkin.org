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
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';

interface CampaignCardProps {
  campaign: ZetkinCampaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { id, title } = campaign;

  return (
    <Card data-testid="campaign-card">
      <CardContent>
        <Typography gutterBottom noWrap variant="h6">
          {title}
        </Typography>
        {/*TODO: labels for calls and surveys*/}
      </CardContent>
      <CardActions sx={{ paddingBottom: 2, paddingLeft: 2 }}>
        <NextLink
          href={`/organize/${orgId}/projects/${id}`}
          legacyBehavior
          passHref
        >
          <Link underline="hover" variant="button">
            <Msg id={messageIds.all.cardCTA} />
          </Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default CampaignCard;
