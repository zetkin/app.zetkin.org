import DateFnsUtils from '@date-io/date-fns';
import { FormattedMessage as Msg } from 'react-intl';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MenuItem, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { getNewDateWithOffset } from 'utils/dateUtils';
import { getTimeFrameWithConfig } from '../utils';
import StyledDatePicker from '../inputs/StyledDatePicker';
import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';
import { TIME_FRAME } from 'features/smartSearch/components/types';

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

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Typography display="inline" variant="h4">
        <Msg
          id={`misc.smartSearch.timeFrame.edit.${selected}`}
          values={{
            afterDateSelect: (
              <StyledDatePicker
                onChange={(date) => setAfter(date as unknown as Date)}
                value={after}
              />
            ),
            beforeDateSelect: (
              <StyledDatePicker
                onChange={(date) => setBefore(date as unknown as Date)}
                value={before}
              />
            ),
            days: numDays,
            daysInput: (
              <StyledNumberInput
                inputProps={{ min: '1' }}
                onChange={(e) => setNumDays(+e.target.value)}
                value={numDays}
              />
            ),
            timeFrameSelect: (
              <StyledSelect
                onChange={(e) => setSelected(e.target.value as TIME_FRAME)}
                SelectProps={{
                  renderValue: function getLabel(value) {
                    return (
                      <Msg
                        id={`misc.smartSearch.timeFrame.timeFrameSelectLabel.${value}`}
                        values={{
                          days: numDays,
                        }}
                      />
                    );
                  },
                }}
                value={selected}
              >
                {options.map((value) => (
                  <MenuItem key={value} value={value}>
                    <Msg
                      id={`misc.smartSearch.timeFrame.timeFrameSelectOptions.${value}`}
                    />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
          }}
        />
      </Typography>
    </MuiPickersUtilsProvider>
  );
};

export default TimeFrame;
