import { FormEvent, useState } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import { Msg, useMessages } from 'core/i18n';
import StyledAutocomplete from '../../inputs/StyledAutocomplete';
import StyledSelect from '../../inputs/StyledSelect';
import useCallAssignments from 'features/callAssignments/hooks/useCallAssignments';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  CallerFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';

const localMessageIds = messageIds.filters.caller;

const ANY_ASSIGNMENT = 'any';

enum CALLER_FILTER_MODE {
  CURRENTLY_ASSIGNED = 'currentlyAssigned',
  CURRENTLY_NOT_ASSIGNED = 'currentlyNotAssigned',
}

interface CallerProps {
  filter: SmartSearchFilterWithId<CallerFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<CallerFilterConfig>
      | ZetkinSmartSearchFilter<CallerFilterConfig>
  ) => void;
  onCancel: () => void;
}

const Caller = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: CallerProps): JSX.Element => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const assignmentsFuture = useCallAssignments(orgId);
  const assignments = assignmentsFuture.data || [];
  const { filter, setConfig, setOp } = useSmartSearchFilter<CallerFilterConfig>(
    initialFilter,
    {
      assignment: null,
      operator: 'assigned',
    }
  );
  const [filterMode, setFilterMode] = useState(
    'config' in initialFilter &&
      initialFilter.config?.operator === 'notassigned'
      ? CALLER_FILTER_MODE.CURRENTLY_NOT_ASSIGNED
      : CALLER_FILTER_MODE.CURRENTLY_ASSIGNED
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submittedConfig: CallerFilterConfig = {
      assignment: filter.config.assignment,
      operator:
        filterMode === CALLER_FILTER_MODE.CURRENTLY_NOT_ASSIGNED
          ? 'notassigned'
          : 'assigned',
      organizations: filter.config.organizations,
    };
    const submittedFilter = {
      ...filter,
      config: submittedConfig,
    };

    onSubmit(submittedFilter);
  };

  const handleAssignmentSelectChange = (assignmentValue: string) => {
    if (assignmentValue === ANY_ASSIGNMENT) {
      setConfig({ ...filter.config, assignment: null });
    } else {
      setConfig({ ...filter.config, assignment: +assignmentValue });
    }
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
                {Object.values(OPERATION).map((operation) => (
                  <MenuItem key={operation} value={operation}>
                    <Msg id={messageIds.operators[operation]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            assignmentSelect: (
              <StyledAutocomplete
                items={[
                  {
                    group: 'pinned',
                    id: ANY_ASSIGNMENT,
                    label: messages.filters.caller.assignmentSelect.any(),
                  },
                  ...assignments.map((assignment) => ({
                    id: assignment.id,
                    label: assignment.title,
                  })),
                ]}
                onChange={(e) => handleAssignmentSelectChange(e.target.value)}
                value={filter.config.assignment ?? ANY_ASSIGNMENT}
              />
            ),
            callerSelect: (
              <StyledSelect
                onChange={(e) => {
                  const callerFilterMode = e.target.value as CALLER_FILTER_MODE;
                  setFilterMode(callerFilterMode);
                }}
                value={filterMode}
              >
                <MenuItem value={CALLER_FILTER_MODE.CURRENTLY_ASSIGNED}>
                  <Msg id={localMessageIds.callerSelect.assigned} />
                </MenuItem>
                <MenuItem value={CALLER_FILTER_MODE.CURRENTLY_NOT_ASSIGNED}>
                  <Msg id={localMessageIds.callerSelect.notassigned} />
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

export default Caller;
