import NextLink from 'next/link';
import {
  Box,
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
import CampaignStatusChip from './CampaignStatusChip';

interface CampaignCardProps {
  campaign: ZetkinCampaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { id, title } = campaign;

  return (
    <Card data-testid="campaign-card">
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            justifyContent: 'space-between',
          }}
        >
          <Typography gutterBottom noWrap variant="h6">
            {title}
          </Typography>
          {/*TODO: labels for calls and surveys*/}
          <CampaignStatusChip campaign={campaign} />
        </Box>
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
