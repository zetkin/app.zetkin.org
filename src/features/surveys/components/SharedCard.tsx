import { GroupWork } from '@mui/icons-material';
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
import { ZetkinSurvey } from 'utils/types/zetkin';

interface SharedCardProps {
  survey: ZetkinSurvey[];
}

const SharedCard = ({ survey }: SharedCardProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();

  return (
    <Card data-testid="campaign-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography gutterBottom noWrap variant="h6">
            <Msg id={messageIds.card.title} />
          </Typography>
          <Box sx={{ display: 'flex', position: 'relative' }}>
            <GroupWork
              color="secondary"
              sx={{ backgroundColor: 'white', borderRadius: '50%', zIndex: 1 }}
            />
            <GroupWork
              color="secondary"
              sx={{ left: 8, position: 'absolute' }}
            />
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ paddingBottom: 2, paddingLeft: 2 }}>
        <NextLink href={`/organize/${orgId}/projects`} legacyBehavior passHref>
          <Link underline="hover" variant="button">
            <Msg id={messageIds.card.cta} />
          </Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default SharedCard;
