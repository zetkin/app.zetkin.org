import { MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import {
  getLoggedCallCountWithConfig,
  normalizeLoggedCallCountConfig,
} from './utils';
import { MATCHING } from 'features/smartSearch/components/types';
import { Msg } from 'core/i18n';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import messageIds from 'features/smartSearch/l10n/messageIds';

const localMessageIds = messageIds.filters.callerParticipation.callCount;

interface LoggedCallCountProps {
  filterConfig: { max?: number; min?: number };
  onChange: (range: { max?: number; min?: number }) => void;
}

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 5;

const MIN_CALL_COUNT = 1;

const getLoggedCallCountConfig = (
  option: MATCHING,
  range: { max?: number; min?: number }
) => {
  if (option === MATCHING.MAX) {
    return {
      max: Math.max(MIN_CALL_COUNT, range.max ?? DEFAULT_MAX),
      min: undefined,
    };
  } else if (option === MATCHING.MIN) {
    return {
      max: undefined,
      min: Math.max(MIN_CALL_COUNT, range.min ?? DEFAULT_MIN),
    };
  } else if (option === MATCHING.BETWEEN) {
    return {
      max: Math.max(MIN_CALL_COUNT, range.max ?? DEFAULT_MAX),
      min: Math.max(MIN_CALL_COUNT, range.min ?? DEFAULT_MIN),
    };
  }

  return { max: undefined, min: DEFAULT_MIN };
};

const getCallCountInputValue = (value: string) => {
  if (!value) {
    return MIN_CALL_COUNT;
  }

  return +value;
};

const LoggedCallCount = ({
  filterConfig,
  onChange,
}: LoggedCallCountProps): JSX.Element => {
  const loggedCallCount = getLoggedCallCountWithConfig(filterConfig);
  const [option, setOption] = useState(loggedCallCount.option);
  const [max, setMax] = useState(loggedCallCount.config?.max);
  const [min, setMin] = useState(loggedCallCount.config?.min);

  const handleOptionChange = (updatedOption: MATCHING) => {
    setOption(updatedOption);
    onChange(getLoggedCallCountConfig(updatedOption, { max, min }));
  };

  const handleMinChange = (updatedMin: number) => {
    setMin(updatedMin);
    onChange(getLoggedCallCountConfig(option, { max, min: updatedMin }));
  };

  const handleMaxChange = (updatedMax: number) => {
    setMax(updatedMax);
    onChange(getLoggedCallCountConfig(option, { max: updatedMax, min }));
  };

  const handleBlur = () => {
    if (option === MATCHING.BETWEEN) {
      const normalizedConfig = normalizeLoggedCallCountConfig({
        max: max ?? DEFAULT_MAX,
        min: min ?? DEFAULT_MIN,
      });
      setMax(normalizedConfig.max);
      setMin(normalizedConfig.min);
      onChange(normalizedConfig);
    }
  };

  const callCountSelect = (
    <StyledSelect
      onChange={(event) => handleOptionChange(event.target.value as MATCHING)}
      value={option}
    >
      {Object.values(MATCHING).map((value) => (
        <MenuItem key={value} value={value}>
          <Msg id={localMessageIds.labels[value]} />
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const minInput = (
    <StyledNumberInput
      onBlur={handleBlur}
      onChange={(event) =>
        handleMinChange(getCallCountInputValue(event.target.value))
      }
      slotProps={{ htmlInput: { min: '1' } }}
      value={min ?? DEFAULT_MIN}
    />
  );

  const maxInput = (
    <StyledNumberInput
      onBlur={handleBlur}
      onChange={(event) =>
        handleMaxChange(getCallCountInputValue(event.target.value))
      }
      slotProps={{ htmlInput: { min: '1' } }}
      value={max ?? DEFAULT_MAX}
    />
  );

  return (
    <Typography display="inline" variant="h4">
      {option === MATCHING.BETWEEN && (
        <Msg
          id={localMessageIds.edit.between}
          values={{ callCountSelect, maxInput, minInput }}
        />
      )}
      {option === MATCHING.MAX && (
        <Msg
          id={localMessageIds.edit.max}
          values={{ callCountSelect, max: max ?? DEFAULT_MAX, maxInput }}
        />
      )}
      {option === MATCHING.MIN && (
        <Msg
          id={localMessageIds.edit.min}
          values={{ callCountSelect, min: min ?? DEFAULT_MIN, minInput }}
        />
      )}
      {option === MATCHING.ONCE && (
        <Msg id={localMessageIds.edit.once} values={{ callCountSelect }} />
      )}
    </Typography>
  );
};

export default LoggedCallCount;
