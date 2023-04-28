import { Dayjs } from 'dayjs';
import { Box, Typography } from '@mui/material';

import theme from 'theme';

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-start"
        width="2em"
      >
        <Typography color={theme.palette.grey[500]} variant="subtitle2">
          {
            // Localized short-format weeekday
            date.toDate().toLocaleDateString(undefined, { weekday: 'short' })
          }
        </Typography>
      </Box>
      <Box>
        <Box
          display="flex"
          sx={{
            alignItems: 'center',
            backgroundColor: focused ? theme.palette.primary.main : null,
            borderRadius: '50%',
            color: focused ? 'white' : 'inherit',
            height: '2.1em',
            justifyContent: 'center',
            width: '2.1em',
          }}
        >
          <Typography color={focused ? 'white' : 'inherit'} fontSize="1.2em">
            {date.format('D')}
          </Typography>
        </Box>
      </Box>
      <Box width="2em"></Box>
    </Box>
  );
};

export default DayHeader;
