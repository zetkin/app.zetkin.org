import NextLink from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';
import CampaignStatusChip from './CampaignStatusChip';

interface CampaignCardProps {
  campaign: ZetkinCampaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { id, title } = campaign;

  return (
    <Card data-testid="campaign-card">
      <CardActionArea
        aria-label={messages.all.cardAriaLabel({ title })}
        component={NextLink}
        href={`/organize/${orgId}/projects/${id}`}
      >
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
            <CampaignStatusChip campaign={campaign} />
          </Box>
        </CardContent>
        <CardActions sx={{ paddingBottom: 2, paddingLeft: 2 }}>
          <Typography
            color="primary"
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            variant="button"
          >
            <Msg id={messageIds.all.cardCTA} />
          </Typography>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default CampaignCard;
