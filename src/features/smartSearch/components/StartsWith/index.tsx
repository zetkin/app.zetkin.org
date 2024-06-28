import { MenuItem } from '@mui/material';
import { FormEvent, useState } from 'react';

import FilterForm from '../FilterForm';
import StyledSelect from 'features/smartSearch/components/inputs/StyledSelect';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.all;

interface StartsWithProps {
  startsWithAll: boolean;
  onSubmit: (startsWithAll: boolean) => void;
  onCancel: () => void;
}

const StartsWith = ({
  startsWithAll,
  onSubmit,
  onCancel,
}: StartsWithProps): JSX.Element => {
  const [shouldStartWithAll, setShouldStartWithAll] = useState(startsWithAll);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(shouldStartWithAll);
  };

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={(e) => handleSubmit(e)}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            startWithSelect: (
              // convert numbers to boolean since MenuItem cannot take boolean as props
              <StyledSelect
                data-testid="StartsWith-select"
                onChange={(e) => setShouldStartWithAll(!!e.target.value)}
                value={+shouldStartWithAll}
              >
                <MenuItem key={1} data-testid="StartsWith-select-all" value={1}>
                  <Msg id={localMessageIds.startWithSelect.true} />
                </MenuItem>
                <MenuItem
                  key={0}
                  data-testid="StartsWith-select-empty"
                  value={0}
                >
                  <Msg id={localMessageIds.startWithSelect.false} />
                </MenuItem>
              </StyledSelect>
            ),
          }}
        />
      )}
    />
  );
};

export default StartsWith;
