import { FC } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';

import { ZetkinEvent } from 'utils/types/zetkin';

type EventSignUpCardProps = {
  event: ZetkinEvent;
};

const EventSignUpCard: FC<EventSignUpCardProps> = ({ event }) => {
  const theme = useTheme();
  // TODO: Instead of always using the en-US .toLocaleString, update to match the user settings.
  const startTime = new Date(event.start_time).toLocaleString('sv-SE', {
    hour: 'numeric',
    minute: 'numeric',
  });

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
          {startTime} - {event.location?.title}
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
          Read more
        </Button>
        <Button size="small" variant="contained">
          Count me in!
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventSignUpCard;
