import theme from 'theme';
import { Box, Typography } from '@mui/material';
import { Msg } from 'core/i18n';
import messageIds from '../../l10n/messageIds';

type CalendarWeekNumberProps = {
  weekNr: number;
};

const HeaderWeekNumber = ({weekNr }: CalendarWeekNumberProps) => {
  return (

    <Box
      marginTop="2px"
      display="flex"
      alignItems="center"
    >
      <Typography
        color={theme.palette.secondary.light}
        fontStyle="bold"
        sx={{ fontWeight: 800 }}
        variant="subtitle2"
      >
       <Msg id={messageIds.ranges.shortWeek} />{weekNr}
      </Typography>
    </Box>
  );
};

export default HeaderWeekNumber;
