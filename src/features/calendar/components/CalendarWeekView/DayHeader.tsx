import { FormattedDate } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import dayjs from 'dayjs';

import theme from 'theme';
import { getDSTOffset } from './utils';
import { Msg } from 'core/i18n';
import messageIds from '../../l10n/messageIds';

export interface DayHeaderProps {
  date: Date;
  focused: boolean;
  onClick: () => void;
}

const DayHeader = ({ date, focused, onClick }: DayHeaderProps) => {
  const dstChangeAmount: number = useMemo(
    () =>
      getDSTOffset(dayjs(date).startOf('day').toDate()) -
      getDSTOffset(dayjs(date).endOf('day').toDate()),
    [date]
  );

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gridTemplateRows="1fr auto"
      onClick={() => onClick()}
      sx={{
        cursor: 'pointer',
      }}
      width="100%"
    >
      {/* Day string */}
      <Box alignItems="center" display="flex" justifyContent="flex-start">
        <Typography color={theme.palette.grey[500]} variant="subtitle2">
          <FormattedDate value={date} weekday="short" />
        </Typography>
      </Box>
      {/* Day number */}
      <Box alignItems="center" display="flex" justifyContent={'space-around'}>
        {/* Circle */}
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          sx={{
            backgroundColor: focused ? theme.palette.primary.main : null,
            borderRadius: '50%',
            color: focused ? 'white' : 'inherit',
            height: '2.1em',
            width: '2.1em',
          }}
        >
          <Typography color={focused ? 'white' : 'inherit'} fontSize="1.2em">
            <FormattedDate day="numeric" value={date} />
          </Typography>
        </Box>
      </Box>
      {/* Empty */}
      <Box />
      {dstChangeAmount !== 0 && (
        <Box gridColumn={'1 / span 3'} gridRow={2}>
          <Typography color={theme.palette.grey[500]} variant="body2">
            {dstChangeAmount > 0 && <Msg id={messageIds.dstStarts} />}
            {dstChangeAmount < 0 && <Msg id={messageIds.dstEnds} />}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DayHeader;
