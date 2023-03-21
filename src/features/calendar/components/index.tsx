import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import MonthCalendar from './MonthCalendar';
import { useFocusDate } from 'utils/hooks/useFocusDate';
import WeekCalendar from './WeekCalendar';
import { CALENDAR_RANGES, getViewRange } from './utils';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinCampaign, ZetkinEvent, ZetkinTask } from 'utils/types/zetkin';

import messageIds from '../l10n/messageIds';

interface ZetkinCalendarProps {
  baseHref: string;
  events: ZetkinEvent[];
  campaigns: ZetkinCampaign[];
  tasks: ZetkinTask[];
}

dayjs.extend(isoWeek);

const useStyles = makeStyles(() => ({
  hide: {
    display: 'hidden',
  },
  today: {
    '&:hover': {
      backgroundColor: 'royalblue',
    },
    background: 'blue',
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '18px',
    minWidth: '18px',
  },
}));

const Calendar = ({
  baseHref,
  events,
  campaigns,
  tasks,
}: ZetkinCalendarProps): JSX.Element => {
  const messages = useMessages(messageIds);
  const { orgId } = useRouter().query;
  const { focusDate, setFocusDate } = useFocusDate();
  const [range, setRange] = useState(CALENDAR_RANGES.MONTH);
  const classes = useStyles();

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  const tasksWithDeadlines = tasks.filter((task) => task.deadline);

  const navigateCalendar = (step: 1 | -1) => {
    if (range === CALENDAR_RANGES.MONTH) {
      setFocusDate(
        new Date(
          focusDate.getFullYear(),
          focusDate.getMonth() + step,
          // Always use day 1 of the month to avoid error when navigating between
          // months with different number of days, ex: Aug = 31, Sep = 30, Feb = 28
          1,
          // Always use 12' noon to avoid timezone issues, ex: September 1st
          // midnight in Sweden is interpreted as 31 of August in UTC
          12
        )
      );
    } else if (range === CALENDAR_RANGES.WEEK) {
      setFocusDate(
        new Date(new Date(focusDate).setDate(focusDate.getDate() + step * 7))
      );
    }
  };

  const handleForwardButtonClick = () => {
    navigateCalendar(1);
  };

  const handleBackButtonClick = () => {
    navigateCalendar(-1);
  };

  const today = new Date();
  const { firstDayInView, lastDayInView } = getViewRange(focusDate, range);

  const isTodayBeforeView = () => {
    return today < firstDayInView;
  };

  const isTodayAfterView = () => {
    return today > lastDayInView;
  };

  const handleTodayBtnClick = () => {
    setFocusDate(today);
  };
  const weekNumber = dayjs(firstDayInView).isoWeek();

  return (
    <Box display="flex" flexDirection="column" height={1} paddingTop={5}>
      <Box
        display="grid"
        flexGrow={0}
        gridTemplateAreas={`". nav view"`}
        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
      >
        <Box
          alignItems="center"
          display="flex"
          gridArea="nav"
          justifyContent="center"
        >
          {isTodayBeforeView() ? (
            <Tooltip arrow placement="top" title="Today">
              <Button className={classes.today} onClick={handleTodayBtnClick} />
            </Tooltip>
          ) : (
            <Button className={classes.hide} disabled />
          )}
          <Button
            color="primary"
            data-testid="back-button"
            onClick={handleBackButtonClick}
          >
            <Msg id={messageIds.prev} />
          </Button>
          <Box
            data-testid="selected-month"
            p={1}
            textAlign="center"
            width="10rem"
          >
            <Typography>
              {range === CALENDAR_RANGES.MONTH && (
                <FormattedDate
                  month="long"
                  value={
                    new Date(
                      focusDate.getUTCFullYear(),
                      focusDate.getUTCMonth() + 1,
                      0
                    )
                  }
                  year="numeric"
                />
              )}
              {range === CALENDAR_RANGES.WEEK && weekNumber}
            </Typography>
          </Box>
          <Button
            color="primary"
            data-testid="fwd-button"
            onClick={handleForwardButtonClick}
          >
            <Msg id={messageIds.next} />
          </Button>
          {isTodayAfterView() ? (
            <Tooltip arrow placement="top" title="Today">
              <Button className={classes.today} onClick={handleTodayBtnClick} />
            </Tooltip>
          ) : (
            <Button className={classes.hide} disabled />
          )}
        </Box>
        <Box
          alignItems="center"
          display="flex"
          gridArea="view"
          justifySelf="end"
          mr={1}
        >
          <TextField
            aria-label={messages.rangeLabel()}
            id="calendar-view"
            onChange={(e) => setRange(e.target.value as CALENDAR_RANGES)}
            select
            value={range}
            variant="standard"
          >
            {Object.values(CALENDAR_RANGES).map((range) => (
              <MenuItem key={range} value={range}>
                <Msg id={messageIds.ranges[range]} />
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <Box flexGrow={1} overflow="auto">
        {range === CALENDAR_RANGES.MONTH && (
          <MonthCalendar
            baseHref={baseHref}
            campaigns={campaigns}
            events={sortedEvents}
            focusDate={focusDate}
            orgId={orgId as string}
            tasks={tasksWithDeadlines}
          />
        )}
        {range === CALENDAR_RANGES.WEEK && (
          <WeekCalendar
            baseHref={baseHref}
            campaigns={campaigns}
            events={sortedEvents}
            focusDate={focusDate}
            orgId={orgId as string}
            tasks={tasksWithDeadlines}
          />
        )}
      </Box>
    </Box>
  );
};

export default Calendar;
