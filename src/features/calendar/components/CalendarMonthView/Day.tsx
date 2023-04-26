import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import theme from 'theme';
import { Box, Typography } from '@mui/material';

type DayProps = {
  date: Date;
  isInFocusMonth: boolean;
};
const Day = ({ date, isInFocusMonth }: DayProps) => {
  const isToday = dayjs(date).isSame(new Date(), 'day');

  let textColor = theme.palette.text.secondary;
  if (isToday) {
    textColor = theme.palette.primary.main;
  } else if (!isInFocusMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <Box
      alignItems="start"
      bgcolor={isInFocusMonth ? '#eee' : 'none'}
      border="2px solid #eeeeee"
      borderColor={isToday ? theme.palette.primary.main : 'eee'}
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <Box marginLeft="5px">
        <Typography color={textColor} fontSize=".8rem">
          <FormattedDate day="numeric" value={date} />
        </Typography>
      </Box>
    </Box>
  );
};

export default Day;
