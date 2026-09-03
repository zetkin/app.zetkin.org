import { MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { getLoggedCallCountWithConfig } from './utils';
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

const getLoggedCallCountConfig = (
  option: MATCHING,
  range: { max?: number; min?: number }
) => {
  if (option === MATCHING.MAX) {
    return { max: range.max || DEFAULT_MAX, min: undefined };
  } else if (option === MATCHING.MIN) {
    return { max: undefined, min: range.min || DEFAULT_MIN };
  } else if (option === MATCHING.BETWEEN) {
    return {
      max: range.max || DEFAULT_MAX,
      min: range.min || DEFAULT_MIN,
    };
  }

  return { max: undefined, min: DEFAULT_MIN };
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
      onChange={(event) => handleMinChange(+event.target.value)}
      value={min || DEFAULT_MIN}
    />
  );

  const maxInput = (
    <StyledNumberInput
      onChange={(event) => handleMaxChange(+event.target.value)}
      value={max || DEFAULT_MAX}
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
          values={{ callCountSelect, max: max || DEFAULT_MAX, maxInput }}
        />
      )}
      {option === MATCHING.MIN && (
        <Msg
          id={localMessageIds.edit.min}
          values={{ callCountSelect, min: min || DEFAULT_MIN, minInput }}
        />
      )}
      {option === MATCHING.ONCE && (
        <Msg id={localMessageIds.edit.once} values={{ callCountSelect }} />
      )}
    </Typography>
  );
};

export default LoggedCallCount;
