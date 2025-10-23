import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import { Box, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';

import messageIds from '../../l10n/messageIds';
import { AnyClusteredEvent } from 'features/calendar/utils/clusterEventsForWeekCalender';
import EventCluster from '../EventCluster';
import { getDstChangeAtDate } from '../utils';
import { Msg } from 'core/i18n';

type DayProps = {
  clusters: AnyClusteredEvent[];
  date: Date;
  isInFocusMonth: boolean;
  itemHeight: number;
  onClick: (date: Date) => void;
};

const Day = ({
  clusters,
  date,
  isInFocusMonth,
  itemHeight,
  onClick,
}: DayProps) => {
  const isToday = dayjs(date).isSame(new Date(), 'day');
  const dstChange = useMemo(() => getDstChangeAtDate(dayjs(date)), [date]);
  const theme = useTheme();

  let textColor = theme.palette.text.secondary;
  if (isToday) {
    textColor = theme.palette.primary.main;
  } else if (!isInFocusMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <Box
      alignItems="stretch"
      bgcolor={
        isInFocusMonth
          ? theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : '#eee'
          : 'none'
      }
      border="2px solid #eeeeee"
      borderColor={
        isToday
          ? theme.palette.primary.main
          : theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : 'eee'
      }
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        overflowY: 'hidden',
      }}
      width="100%"
    >
      <Box marginLeft="5px">
        <Typography
          color={textColor}
          onClick={() => onClick(date)}
          sx={{
            cursor: 'pointer',
          }}
          variant="body2"
        >
          <FormattedDate day="numeric" value={date} />
        </Typography>
      </Box>
      {dstChange !== undefined && (
        <Box paddingLeft="4px">
          <Typography color={theme.palette.grey[500]} variant="body2">
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
      {clusters.map((cluster, index) => {
        return (
          <Box
            key={index}
            sx={{
              margin: '1px',
            }}
          >
            <EventCluster
              cluster={cluster}
              compact={true}
              height={itemHeight}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default Day;
