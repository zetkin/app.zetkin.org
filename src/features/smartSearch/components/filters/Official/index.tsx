import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  OfficialFilterConfig,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.official;

interface OfficialProps {
  filter: SmartSearchFilterWithId<OfficialFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<OfficialFilterConfig>
      | ZetkinSmartSearchFilter<OfficialFilterConfig>
  ) => void;
  onCancel: () => void;
}

const Official = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: OfficialProps): JSX.Element => {
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<OfficialFilterConfig>(initialFilter, {});
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
            roleSelect: (
              <StyledSelect
                onChange={(e) => {
                  const role =
                    e.target.value === 'any' ? undefined : e.target.value;
                  setConfig({
                    ...filter.config,
                    role: role as 'organizer' | 'admin' | undefined,
                  });
                }}
                value={filter.config.role || 'any'}
              >
                <MenuItem key="any" value="any">
                  <Msg id={localMessageIds.roleSelect.any} />
                </MenuItem>
                <MenuItem key="organizer" value="organizer">
                  <Msg id={localMessageIds.roleSelect.organizer} />
                </MenuItem>
                <MenuItem key="admin" value="admin">
                  <Msg id={localMessageIds.roleSelect.admin} />
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

export default Official;
