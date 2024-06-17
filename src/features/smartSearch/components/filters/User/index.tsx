import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';

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

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.user;

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
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => (
        <>
          <Msg id={localMessageIds.examples.one} />
          <br />
          <Msg id={localMessageIds.examples.two} />
        </>
      )}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                  <Msg id={messageIds.operators.add} />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id={messageIds.operators.sub} />
                </MenuItem>
                <MenuItem key={OPERATION.LIMIT} value={OPERATION.LIMIT}>
                  <Msg id={messageIds.operators.limit} />
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
                  <Msg id={localMessageIds.connectedSelect.true} />
                </MenuItem>
                <MenuItem key={0} value={0}>
                  <Msg id={localMessageIds.connectedSelect.false} />
                </MenuItem>
              </StyledSelect>
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default User;
