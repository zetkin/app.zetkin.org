import { FC } from 'react';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { Card, CardActions, Typography, CardContent, CardMedia, Button } from '@mui/material';
import theme from '/src/theme';

type EventListingProps = {
  orgId: number;
  campId: number;
};

const EventListing: FC<EventListingProps> = ({ orgId, campId }) => {
  const eventsFromDateRange = useEventsFromDateRange(
    new Date(),
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  ); // TODO: Smarter date handling. We dont just want to do next 60 days.
  console.log('Events with date range', eventsFromDateRange);

  return (
    <>
      {eventsFromDateRange &&
        eventsFromDateRange.map((data) => {
          return (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data.data.title}
                </Typography>
                <Typography variant="body2" color={theme.palette.secondary.main}>
                  {data.data.info_text}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          );
        })}
    </>
  );
};

export default EventListing;
