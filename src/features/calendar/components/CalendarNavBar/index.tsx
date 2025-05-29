import { Box } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton } from '@mui/material';

import { TimeScale } from 'features/calendar/types';
import CalendarEventFilter from '../CalendarEventFilter';
import messageIds from 'features/calendar/l10n/messageIds';
import MonthSelect from './MonthSelect';
import { Msg } from 'core/i18n';
import YearSelect from './YearSelect';
import { useFocusDate } from 'utils/hooks/useFocusDate';

export interface CalendarNavBarProps {
  onChangeFocusDate: (date: Date) => void;
  onChangeTimeScale: (timeScale: TimeScale) => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  orgId: number;
  timeScale: TimeScale;
}

const CalendarNavBar = ({
  onChangeFocusDate,
  onChangeTimeScale,
  onStepBackward,
  onStepForward,
  orgId,
  timeScale,
}: CalendarNavBarProps) => {
  const { focusDate } = useFocusDate();
  return (
    <Box display="flex" justifyContent="space-between">
      <Box alignItems="center" display="flex" gap="4px">
        <Button
          color="primary"
          onClick={() => onChangeFocusDate(new Date())}
          variant="outlined"
        >
          <Msg id={messageIds.today} />
        </Button>
        <IconButton onClick={onStepBackward}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={onStepForward}>
          <ArrowForward />
        </IconButton>
        <MonthSelect
          focusDate={focusDate}
          onChange={(date) => onChangeFocusDate(date)}
        />
        <YearSelect
          focusDate={focusDate}
          onChange={(date) => onChangeFocusDate(date)}
        />
      </Box>
      <Box>
        <ButtonGroup>
          <Button
            onClick={() => onChangeTimeScale('day')}
            variant={timeScale === 'day' ? 'contained' : 'outlined'}
          >
            <Msg id={messageIds.ranges.day} />
          </Button>
          <Button
            onClick={() => onChangeTimeScale('week')}
            variant={timeScale === 'week' ? 'contained' : 'outlined'}
          >
            <Msg id={messageIds.ranges.week} />
          </Button>
          <Button
            onClick={() => onChangeTimeScale('month')}
            variant={timeScale === 'month' ? 'contained' : 'outlined'}
          >
            <Msg id={messageIds.ranges.month} />
          </Button>
        </ButtonGroup>
        <CalendarEventFilter orgId={orgId} />
      </Box>
    </Box>
  );
};

export default CalendarNavBar;
