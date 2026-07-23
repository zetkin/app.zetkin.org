import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';

import oldTheme from 'theme';
import { getDstChangeAtDate } from '../utils';
import { Msg } from 'core/i18n';
import messageIds from '../../l10n/messageIds';

export interface DayHeaderProps {
  date: Temporal.PlainDate;
  focused: boolean;
  onClick: () => void;
}

const DayHeader = ({ date, focused, onClick }: DayHeaderProps) => {
  const intl = useIntl();
  const dstChange = useMemo(() => getDstChangeAtDate(date), [date]);

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
        <Typography color={oldTheme.palette.grey[500]} variant="subtitle2">
          {date.toLocaleString(intl.locale, { weekday: 'short' })}
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
            backgroundColor: focused ? oldTheme.palette.primary.main : null,
            borderRadius: '50%',
            color: focused ? 'white' : 'inherit',
            height: '2.1em',
            width: '2.1em',
          }}
        >
          <Typography color={focused ? 'white' : 'inherit'} fontSize="1.2em">
            {date.day}
          </Typography>
        </Box>
      </Box>
      {/* Empty */}
      <Box />
      {dstChange !== undefined && (
        <Box gridColumn={'1 / span 3'} gridRow={2}>
          <Typography color={oldTheme.palette.grey[500]} variant="body2">
            <Msg
              id={
                dstChange === 'summertime'
                  ? messageIds.dstStarts
                  : messageIds.dstEnds
              }
            />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DayHeader;
