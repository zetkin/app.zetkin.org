import { Box } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import EventFilterPane from './EventFilterPane';
import messageIds from 'features/calendar/l10n/messageIds';
import MonthSelect from './MonthSelect';
import { Msg } from 'core/i18n';
import { TimeScale } from '../index';
import { usePanes } from 'utils/panes';
import YearSelect from './YearSelect';

export interface CalendarNavBarProps {
  focusDate: Date;
  onChangeFocusDate: (date: Date) => void;
  onChangeTimeScale: (timeScale: TimeScale) => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  timeScale: TimeScale;
}

const CalendarNavBar = ({
  focusDate,
  onChangeFocusDate,
  onChangeTimeScale,
  onStepBackward,
  onStepForward,
  timeScale,
}: CalendarNavBarProps) => {
  const { openPane } = usePanes();

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
            onClick={() => onChangeTimeScale(TimeScale.DAY)}
            variant={timeScale === TimeScale.DAY ? 'contained' : 'outlined'}
          >
            <Msg id={messageIds.ranges.day} />
          </Button>
          <Button
            onClick={() => onChangeTimeScale(TimeScale.WEEK)}
            variant={timeScale === TimeScale.WEEK ? 'contained' : 'outlined'}
          >
            <Msg id={messageIds.ranges.week} />
          </Button>
          <Button
            onClick={() => onChangeTimeScale(TimeScale.MONTH)}
            variant={timeScale === TimeScale.MONTH ? 'contained' : 'outlined'}
          >
            <Msg id={messageIds.ranges.month} />
          </Button>
        </ButtonGroup>
        <Button
          startIcon={<FilterListIcon />}
          variant="outlined"
          sx={{ ml: 2 }}
          onClick={() =>
            openPane({
              render() {
                return <EventFilterPane />;
              },
              width: 400,
            })
          }
        >
          <Msg id={messageIds.eventFilter.filter} />
        </Button>
      </Box>
    </Box>
  );
};

export default CalendarNavBar;
