import { MenuItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { getMatchingWithConfig } from '../utils';
import { MATCHING } from 'features/smartSearch/components/types';
import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';

interface MatchingProps {
  onChange: (range: { max?: number; min?: number }) => void;
  filterConfig: { max?: number; min?: number };
  options?: MATCHING[];
}

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 5;

const Matching = ({
  onChange,
  filterConfig,
  options = Object.values(MATCHING),
}: MatchingProps): JSX.Element => {
  const matching = getMatchingWithConfig(filterConfig);

  const [option, setOption] = useState(matching.option);
  const [max, setMax] = useState(matching.config?.max);
  const [min, setMin] = useState(matching.config?.min);

  useEffect(() => {
    if (option == MATCHING.MAX) {
      onChange({ max: max, min: undefined });
    } else if (option == MATCHING.MIN) {
      onChange({ max: undefined, min: min });
    } else if (option == MATCHING.BETWEEN) {
      onChange({ max: max || DEFAULT_MAX, min: min || DEFAULT_MIN });
    } else if (option == MATCHING.ONCE) {
      onChange({ max: undefined, min: undefined });
    }
  }, [min, max, option]);

  const matchingSelect = (
    <StyledSelect
      onChange={(e) => setOption(e.target.value as MATCHING)}
      value={option}
    >
      {options.map((value) => (
        <MenuItem key={value} value={value}>
          <Msg id={messageIds.matching.labels[value]} />
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const minInput = (
    <StyledNumberInput
      onChange={(e) => setMin(+e.target.value)}
      value={min || DEFAULT_MIN}
    />
  );
  const maxInput = (
    <StyledNumberInput
      onChange={(e) => setMax(+e.target.value)}
      value={max || DEFAULT_MAX}
    />
  );

  return (
    <Typography display="inline" variant="h4">
      {option == 'between' && (
        <Msg
          id={messageIds.matching.edit.between}
          values={{ matchingSelect, maxInput, minInput }}
        />
      )}
      {option == 'max' && (
        <Msg
          id={messageIds.matching.edit.max}
          values={{ matchingSelect, max: max || 1, maxInput }}
        />
      )}
      {option == 'min' && (
        <Msg
          id={messageIds.matching.edit.min}
          values={{ matchingSelect, min: min || 1, minInput }}
        />
      )}
      {option == 'once' && (
        <Msg id={messageIds.matching.edit.once} values={{ matchingSelect }} />
      )}
    </Typography>
  );
};

export default Matching;
