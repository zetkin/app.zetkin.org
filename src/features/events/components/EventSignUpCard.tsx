import { FC } from 'react';
import { FormattedTime } from 'react-intl';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import useEventSignup from '../hooks/useEventSignup';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';

type EventSignUpCardProps = {
  event: ZetkinEvent;
};

const EventSignUpCard: FC<EventSignUpCardProps> = ({ event }) => {
  const theme = useTheme();
  const eventSignupFuture = useEventSignup(event.organization.id, event.id);

  return (
    <Card>
      <CardMedia
        alt={event.title || undefined}
        component="img"
        height="140"
        image="https://zetkin.org/assets/img/hero.jpg"
      />
      <CardContent>
        <Typography component="div" gutterBottom variant="h5">
          {event.title}
        </Typography>
        <Typography
          component="p"
          gutterBottom
          sx={{ color: theme.palette.secondary.main, fontSize: '.7rem' }}
        >
          <FormattedTime hour12={false} value={event.start_time} /> -{' '}
          {event.location?.title}
        </Typography>
        <Typography color={theme.palette.secondary.main} variant="body2">
          {event.info_text}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          href={`/o/${event.organization.id}/projects/${event.id}`}
          size="small"
        >
          <Msg id={messageIds.signupCard.moreInfo} />
        </Button>
        <ZUIFuture future={eventSignupFuture}>
          {({ myResponseState, signup, undoSignup }) => (
            <>
              {myResponseState == 'signedUp' && (
                <Button
                  onClick={() => {
                    undoSignup();
                  }}
                  size="small"
                  variant="outlined"
                >
                  <Msg id={messageIds.signupCard.undo} />
                </Button>
              )}
              {myResponseState == 'notSignedUp' && (
                <Button
                  onClick={() => {
                    signup();
                  }}
                  size="small"
                  variant="contained"
                >
                  <Msg id={messageIds.signupCard.signUp} />
                </Button>
              )}
            </>
          )}
        </ZUIFuture>
      </CardActions>
    </Card>
  );
};

export default EventSignUpCard;
