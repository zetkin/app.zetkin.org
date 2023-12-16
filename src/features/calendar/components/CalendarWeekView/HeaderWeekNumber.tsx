import { Msg } from 'core/i18n';
import theme from 'theme';
import { Box, Typography } from '@mui/material';

import messageIds from '../../l10n/messageIds';

type CalendarWeekNumberProps = {
  weekNr: number;
};

const HeaderWeekNumber = ({ weekNr }: CalendarWeekNumberProps) => {
  return (
    <Box alignItems="center" display="flex" marginTop="2px">
      <Typography
        color={theme.palette.secondary.light}
        fontStyle="bold"
        sx={{ fontWeight: 800 }}
        variant="subtitle2"
      >
        <Msg id={messageIds.ranges.shortWeek} />
        {weekNr}
      </Typography>
    </Box>
  );
};

export default HeaderWeekNumber;
