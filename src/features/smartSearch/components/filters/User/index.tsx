import { FormEvent } from 'react';
import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';

import FilterForm from '../../FilterForm';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  UserFilterConfig,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

interface UserProps {
  filter: SmartSearchFilterWithId<UserFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<UserFilterConfig>
      | ZetkinSmartSearchFilter<UserFilterConfig>
  ) => void;
  onCancel: () => void;
}

const User = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: UserProps): JSX.Element => {
  const { filter, setConfig, setOp } = useSmartSearchFilter<UserFilterConfig>(
    initialFilter,
    { is_user: true }
  );
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  return (
    <FilterForm
      onCancel={onCancel}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => (
        <>
          <Msg id="misc.smartSearch.user.examples.one" />
          <br />
          <Msg id="misc.smartSearch.user.examples.two" />
        </>
      )}
      renderSentence={() => (
        <Msg
          id="misc.smartSearch.user.inputString"
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                  <Msg id="misc.smartSearch.user.addRemoveSelect.add" />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id="misc.smartSearch.user.addRemoveSelect.sub" />
                </MenuItem>
              </StyledSelect>
            ),
            connectedSelect: (
              <StyledSelect
                onChange={(e) => {
                  setConfig({
                    ...filter.config,
                    is_user: !!e.target.value, // convert numbers to boolean since MenuItem cannot take boolean as props
                  });
                }}
                value={+filter.config.is_user}
              >
                <MenuItem key={1} value={1}>
                  <Msg id="misc.smartSearch.user.connectedSelect.true" />
                </MenuItem>
                <MenuItem key={0} value={0}>
                  <Msg id="misc.smartSearch.user.connectedSelect.false" />
                </MenuItem>
              </StyledSelect>
            ),
          }}
        />
      )}
    />
  );
};

export default User;
