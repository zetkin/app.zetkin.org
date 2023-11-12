import { Card, Typography, CardContent, Box } from '@mui/material';
import { FC } from 'react';
import theme from '/src/theme';

import { FormattedDate } from 'react-intl';

import EventSignUpCard from './EventSignUpCard';
import { ZetkinEvent } from 'utils/types/zetkin';

type EventSignUpListProps = {
  events: ZetkinEvent[];
};

let previousDate;
let isSameAsPrevious = false;

const EventSignUpList: FC<EventSignUpListProps> = ({ events }) => {

  return (

    <Box>
      {events.map((event) => {

        const previousDateObj = new Date(previousDate)
        const startTimeObj = new Date(event.start_time)

        isSameAsPrevious = (previousDateObj.getDate() === startTimeObj.getDate() 
             && previousDateObj.getMonth() === startTimeObj.getMonth()
             && previousDateObj.getFullYear() === startTimeObj.getFullYear())

        previousDate = event.start_time

        return (<>
          { isSameAsPrevious ? (
              <div style={{ minHeight: '2rem' }}></div> // That date was already rendered, so here we just make a spacer
            ) : (
              <CardContent sx={{backgroundColor: theme.palette.background.secondary}} variant="h5" component="div">
                <Typography>
                  <FormattedDate day="numeric" month="numeric" value={event.start_time} />
                  &nbsp;
                  <FormattedDate weekday="long"  value={event.start_time} />
                </Typography>
              </CardContent>
            )
          }
          <EventSignUpCard key={event.id} event={event} />
        </>)
      })}
    </Box>

  );
};

export default EventSignUpList;
