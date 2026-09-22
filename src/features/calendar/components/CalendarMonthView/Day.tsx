import { Add } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import messageIds from '../../l10n/messageIds';
import oldTheme from 'theme';
import { AnyClusteredEvent } from 'features/calendar/utils/clusterEventsForWeekCalender';
import EventCluster from '../EventCluster';
import { getDstChangeAtDate } from '../utils';
import { Msg, useMessages } from 'core/i18n';

type DayProps = {
  clusters: AnyClusteredEvent[];
  date: Temporal.PlainDate;
  disabled: boolean;
  isInFocusMonth: boolean;
  itemHeight: number;
  menuId?: string;
  onClick: (date: Temporal.PlainDate) => void;
  onCreate: (anchorEl: HTMLButtonElement) => void;
};

const Day = ({
  clusters,
  date,
  disabled,
  isInFocusMonth,
  itemHeight,
  menuId,
  onClick,
  onCreate,
}: DayProps) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const createLabel = messages.createOnDate({
    date: date.toLocaleString(intl.locale, { dateStyle: 'long' }),
  });
  const isToday = date.equals(Temporal.Now.plainDateISO());
  const dstChange = useMemo(() => getDstChangeAtDate(date), [date]);

  let textColor = oldTheme.palette.text.secondary;
  if (isToday) {
    textColor = oldTheme.palette.primary.main;
  } else if (!isInFocusMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <Box
      alignItems="stretch"
      bgcolor={isInFocusMonth ? '#eee' : 'none'}
      border="2px solid #eeeeee"
      borderColor={isToday ? oldTheme.palette.primary.main : 'eee'}
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        '&:hover .create-event, &:focus-within .create-event': {
          opacity: 1,
        },
        overflowY: 'hidden',
      }}
      width="100%"
    >
      <Box alignItems="center" display="flex" marginLeft="5px">
        <Typography
          color={textColor}
          onClick={() => onClick(date)}
          sx={{
            cursor: 'pointer',
          }}
          variant="body2"
        >
          {date.day}
        </Typography>
        <Tooltip title={createLabel}>
          <IconButton
            aria-controls={menuId}
            aria-expanded={!!menuId}
            aria-haspopup="menu"
            aria-label={createLabel}
            className="create-event"
            disabled={disabled}
            onClick={(ev) => onCreate(ev.currentTarget)}
            size="small"
            sx={{
              '@media (hover: none)': { opacity: 1 },
              height: 20,
              marginLeft: 0.5,
              opacity: menuId ? 1 : 0,
              padding: 0,
              width: 20,
            }}
          >
            <Add sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
      {dstChange !== undefined && (
        <Box paddingLeft="4px">
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
