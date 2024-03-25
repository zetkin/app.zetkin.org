import dayjs from 'dayjs';
import { MenuItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { getNewDateWithOffset } from 'utils/dateUtils';
import { getTimeFrameWithConfig } from '../utils';
import { Msg } from 'core/i18n';
import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';
import { TIME_FRAME } from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledDatePicker from '../inputs/StyledDatePicker';

interface TimeFrameProps {
  onChange: (range: { after?: string; before?: string }) => void;
  filterConfig: { after?: string; before?: string };
  options?: TIME_FRAME[];
}

const TimeFrame = ({
  onChange,
  filterConfig,
  options = Object.values(TIME_FRAME),
}: TimeFrameProps): JSX.Element => {
  const timeFrame = getTimeFrameWithConfig(filterConfig);
  const [selected, setSelected] = useState<TIME_FRAME>(timeFrame.timeFrame);
  const today = new Date();
  const [before, setBefore] = useState(timeFrame.before || today);
  const [after, setAfter] = useState(
    timeFrame.after || getNewDateWithOffset(today, -30)
  );
  const [numDays, setNumDays] = useState(timeFrame.numDays || 30);

  useEffect(() => {
    if (selected === TIME_FRAME.EVER) {
      onChange({});
    }
    if (selected === TIME_FRAME.BEFORE_TODAY) {
      onChange({ before: 'now' });
    }
    if (selected === TIME_FRAME.FUTURE) {
      onChange({ after: 'now' });
    }
    if (selected === TIME_FRAME.LAST_FEW_DAYS) {
      onChange({ after: `-${numDays}d` });
    }
    if (selected === TIME_FRAME.BEFORE_DATE) {
      onChange({ before: before.toISOString().slice(0, 10) });
    }
    if (selected === TIME_FRAME.AFTER_DATE) {
      onChange({ after: after.toISOString().slice(0, 10) });
    }
    if (selected === TIME_FRAME.BETWEEN) {
      onChange({
        after: after.toISOString().slice(0, 10),
        before: before.toISOString().slice(0, 10),
      });
    }
  }, [before, after, selected, numDays]);

  const afterDateSelect = (
    <StyledDatePicker
      onChange={(date) => {
        if (date && !isNaN(date.day())) {
          setAfter(date.toDate());
        }
      }}
      value={dayjs(after)}
    />
  );
  const beforeDateSelect = (
    <StyledDatePicker
      onChange={(date) => {
        if (date && !isNaN(date.day())) {
          setBefore(date.toDate());
        }
      }}
      value={dayjs(before)}
    />
  );
  const timeFrameSelect = (
    <StyledSelect
      onChange={(e) => setSelected(e.target.value as TIME_FRAME)}
      SelectProps={{
        renderValue: function getLabel(value) {
          return (
            <Msg
              id={
                messageIds.timeFrame.timeFrameSelectLabel[value as TIME_FRAME]
              }
            />
          );
        },
      }}
      value={selected}
    >
      {options.map((value) => (
        <MenuItem key={value} value={value}>
          <Msg id={messageIds.timeFrame.timeFrameSelectOptions[value]} />
        </MenuItem>
      ))}
    </StyledSelect>
  );

  return (
    <Typography display="inline" variant="h4">
      {selected == 'afterDate' && (
        <Msg
          id={messageIds.timeFrame.edit.afterDate}
          values={{
            afterDateSelect,
            timeFrameSelect,
          }}
        />
      )}
      {selected == 'beforeDate' && (
        <Msg
          id={messageIds.timeFrame.edit.beforeDate}
          values={{
            beforeDateSelect,
            timeFrameSelect,
          }}
        />
      )}
      {selected == 'beforeToday' && (
        <Msg
          id={messageIds.timeFrame.edit.beforeToday}
          values={{ timeFrameSelect }}
        />
      )}
      {selected == 'between' && (
        <Msg
          id={messageIds.timeFrame.edit.between}
          values={{
            afterDateSelect,
            beforeDateSelect,
            timeFrameSelect,
          }}
        />
      )}
      {selected == 'ever' && (
        <Msg id={messageIds.timeFrame.edit.ever} values={{ timeFrameSelect }} />
      )}
      {selected == 'future' && (
        <Msg
          id={messageIds.timeFrame.edit.future}
          values={{ timeFrameSelect }}
        />
      )}
      {selected == 'lastFew' && (
        <Msg
          id={messageIds.timeFrame.edit.lastFew}
          values={{
            days: numDays,
            daysInput: (
              <StyledNumberInput
                inputProps={{ min: '1' }}
                onChange={(e) => setNumDays(+e.target.value)}
                value={numDays}
              />
            ),
            timeFrameSelect,
          }}
        />
      )}
    </Typography>
  );
};

export default TimeFrame;
