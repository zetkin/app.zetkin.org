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

  // Sorting events by date. Closest date at the top
  const sortedEventsFromDateRange = eventsFromDateRange.sort(
    (e0, e1) =>
      new Date(e0.data.start_time).getTime() - new Date(e1.data.start_time).getTime()
  );
  
  return (
    <>
      {sortedEventsFromDateRange &&
        sortedEventsFromDateRange.map((data) => {
          return (
            <Card sx={{marginTop: '2rem'}}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="180"
                image="https://zetkin.org/assets/img/hero.jpg" // TODO: Add dynamic images
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data.data.title}
                </Typography>
                <Typography variant="body2" color={theme.palette.secondary.main}>
                  {data.data.info_text}
                </Typography>
              </CardContent>
              <CardActions style={{justifyContent: 'space-between'}}>
                <Button size="small" href={`/o/${data.data.organization.id}/projects/${data.data.id}`}>Read more</Button>
                <Button variant="contained" size="small">Count me in!</Button>
              </CardActions>
            </Card>
          );
        })}
        {/*
        {eventsFromDateRange &&
        eventsFromDateRange.map((data) => {
          return (
            <Card sx={{marginTop: '2rem'}}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="180"
                image="https://zetkin.org/assets/img/hero.jpg" // TODO: Add dynamic images
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data.data.title}
                </Typography>
                <Typography variant="body2" color={theme.palette.secondary.main}>
                  {data.data.info_text}
                </Typography>
              </CardContent>
              <CardActions style={{justifyContent: 'space-between'}}>
                <Button size="small" href={`/o/${data.data.organization.id}/projects/${data.data.id}`}>Read more</Button>
                <Button variant="contained" size="small">Count me in!</Button>
              </CardActions>
            </Card>
          );
        })}*/}
    </>
  );
};

export default EventListing;
