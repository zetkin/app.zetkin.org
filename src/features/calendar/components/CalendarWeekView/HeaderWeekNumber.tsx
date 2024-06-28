import { Box, Typography, useTheme } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from '../../l10n/messageIds';

type CalendarWeekNumberProps = {
  weekNr: number;
};

const HeaderWeekNumber = ({ weekNr }: CalendarWeekNumberProps) => {
  const theme = useTheme();
  return (
    <Box alignItems="center" display="flex" marginTop="2px">
      <Typography color={theme.palette.secondary.light} variant="subtitle2">
        <Msg id={messageIds.shortWeek} values={{ weekNumber: weekNr }} />
      </Typography>
    </Box>
  );
};

export default HeaderWeekNumber;
