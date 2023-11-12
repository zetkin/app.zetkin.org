import { FC } from 'react';
import { FormattedDate } from 'react-intl';
import { Box, Typography } from '@mui/material';

import EventSignUpCard from './EventSignUpCard';
import { ZetkinEvent } from 'utils/types/zetkin';

type EventSignUpListProps = {
  events: ZetkinEvent[];
};

let previousStartTime: string | null;

const EventSignUpList: FC<EventSignUpListProps> = ({ events }) => {
  return (
    <Box>
      {events.map((event) => {
        const isSameAsPrevious =
          event.start_time.slice(0, 10) == previousStartTime?.slice(0, 10);

        previousStartTime = event.start_time;

        return (
          <Box key={event.id} my={1}>
            {!isSameAsPrevious && (
              <Box margin={2} my={2}>
                <Typography variant="h5">
                  <FormattedDate
                    day="numeric"
                    month="numeric"
                    value={event.start_time}
                  />
                  &nbsp;
                  <FormattedDate value={event.start_time} weekday="long" />
                </Typography>
              </Box>
            )}
            <EventSignUpCard event={event} />
          </Box>
        );
      })}
    </Box>
  );
};

export default EventSignUpList;
