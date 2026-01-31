import { GroupWork } from '@mui/icons-material';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';

import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import oldTheme from 'theme';
import { useNumericRouteParams } from 'core/hooks';

const SharedCard = (): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const title = messages.shared.title();

  return (
    <Card
      data-testid="campaign-card"
      sx={{ border: `2px solid ${oldTheme.palette.primary.main}` }}
    >
      <CardActionArea
        aria-label={messages.all.cardAriaLabel({ title })}
        component={NextLink}
        href={`/organize/${orgId}/projects/shared`}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography gutterBottom noWrap variant="h6">
              <Msg id={messageIds.shared.title} />
            </Typography>
            <Box sx={{ display: 'flex', mr: '0.3rem', position: 'relative' }}>
              <GroupWork
                color="secondary"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  zIndex: 1,
                }}
              />
              <GroupWork
                color="secondary"
                sx={{ left: 8, position: 'absolute' }}
              />
            </Box>
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
            <Msg id={messageIds.shared.cta} />
          </Typography>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default SharedCard;
