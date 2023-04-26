import dayjs from 'dayjs';
import theme from 'theme';
import { useIntl } from 'react-intl';
import { Box, ButtonBase, Typography } from '@mui/material';

type DayProps = {
  date: Date;
  isInFocusMonth: boolean;
};
const Day = ({ date, isInFocusMonth }: DayProps) => {
  const isToday = dayjs(date).isSame(new Date(), 'day');
  const { locale } = useIntl();

  let textColor = theme.palette.text.secondary;
  if (isToday) {
    textColor = theme.palette.primary.main;
  } else if (!isInFocusMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <>
      <ButtonBase
        sx={{
          background: 'none',
          border: 'none',
          outline: 'none',
          padding: '0',
        }}
      >
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
              {date.toLocaleDateString(locale, { day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </ButtonBase>
    </>
  );
};

export default Day;
