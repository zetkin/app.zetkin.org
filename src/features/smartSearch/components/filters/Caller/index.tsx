import { FormEvent, useState } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import { Msg, useMessages } from 'core/i18n';
import StyledAutocomplete from '../../inputs/StyledAutocomplete';
import StyledSelect from '../../inputs/StyledSelect';
import useCallAssignments from 'features/callAssignments/hooks/useCallAssignments';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  AnyFilterConfig,
  CallerFilterConfig,
  CallerParticipationFilterConfig,
  FILTER_TYPE,
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
  PARTICIPATED = 'participated',
}

interface CallerProps {
  filter: SmartSearchFilterWithId<AnyFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<AnyFilterConfig>
      | ZetkinSmartSearchFilter<AnyFilterConfig>
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
  const assignmentsFuture = useCallAssignments(orgId, true);
  const assignments = assignmentsFuture.data || [];
  const { filter, setConfig, setOp } = useSmartSearchFilter<
    CallerFilterConfig | CallerParticipationFilterConfig
  >(initialFilter, {
    operator: 'assigned',
  });
  const [filterMode, setFilterMode] = useState(
    initialFilter.type === FILTER_TYPE.CALLER_PARTICIPATION
      ? CALLER_FILTER_MODE.PARTICIPATED
      : (initialFilter as SmartSearchFilterWithId<CallerFilterConfig>).config
            ?.operator === 'notassigned'
        ? CALLER_FILTER_MODE.CURRENTLY_NOT_ASSIGNED
        : CALLER_FILTER_MODE.CURRENTLY_ASSIGNED
  );
  const callerConfig = filter.config as CallerFilterConfig &
    CallerParticipationFilterConfig;
  const selectedAssignment = callerConfig.assignment;
  const operationOptions = Object.values(OPERATION).filter(
    (operation) =>
      selectedAssignment ||
      filterMode === CALLER_FILTER_MODE.PARTICIPATED ||
      operation !== OPERATION.LIMIT
  );

  const getSubmittedType = () =>
    filterMode === CALLER_FILTER_MODE.PARTICIPATED
      ? FILTER_TYPE.CALLER_PARTICIPATION
      : FILTER_TYPE.CALLER;

  const getSubmittedConfig = (
    config: CallerFilterConfig & Partial<CallerParticipationFilterConfig>
  ): CallerFilterConfig | CallerParticipationFilterConfig => {
    if (filterMode === CALLER_FILTER_MODE.PARTICIPATED) {
      return {
        assignment: config.assignment,
        assignmentIds: undefined,
        num_calls: {
          min: 1,
        },
        organizations: config.organizations,
      };
    }

    return {
      assignment: config.assignment,
      assignmentIds: config.assignmentIds,
      operator:
        filterMode === CALLER_FILTER_MODE.CURRENTLY_NOT_ASSIGNED
          ? 'notassigned'
          : 'assigned',
      organizations: config.organizations,
    };
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const config = { ...filter.config } as CallerFilterConfig &
      Partial<CallerParticipationFilterConfig> & {
        active?: boolean;
        assignmentStatus?: string;
      };
    delete config.active;
    delete config.assignmentStatus;
    delete config.num_calls;

    const submittedConfig = config.assignment
      ? getSubmittedConfig({ ...config, assignmentIds: undefined })
      : getSubmittedConfig({
          ...config,
          assignmentIds: assignments.map((assignment) => assignment.id),
        });
    const submittedFilter = {
      ...filter,
      config: submittedConfig,
      type: getSubmittedType(),
    };

    onSubmit(submittedFilter);
  };

  const handleAssignmentSelectChange = (assignmentValue: string) => {
    if (assignmentValue === ANY_ASSIGNMENT) {
      if (
        filter.op === OPERATION.LIMIT &&
        filterMode !== CALLER_FILTER_MODE.PARTICIPATED
      ) {
        setOp(OPERATION.ADD);
      }
      setConfig({ ...filter.config, assignment: undefined });
    } else {
      setConfig({ ...filter.config, assignment: +assignmentValue });
    }
  };

  return (
    <FilterForm
      disableSubmit={!filter.config.assignment && !assignments.length}
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
                {operationOptions.map((operation) => (
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
                value={filter.config.assignment || ANY_ASSIGNMENT}
              />
            ),
            callerSelect: (
              <StyledSelect
                onChange={(e) => {
                  const callerFilterMode = e.target.value as CALLER_FILTER_MODE;
                  setFilterMode(callerFilterMode);
                  if (
                    callerFilterMode !== CALLER_FILTER_MODE.PARTICIPATED &&
                    filter.op === OPERATION.LIMIT &&
                    !filter.config.assignment
                  ) {
                    setOp(OPERATION.ADD);
                  }
                }}
                value={filterMode}
              >
                <MenuItem value={CALLER_FILTER_MODE.CURRENTLY_ASSIGNED}>
                  <Msg id={localMessageIds.callerSelect.assigned} />
                </MenuItem>
                <MenuItem value={CALLER_FILTER_MODE.CURRENTLY_NOT_ASSIGNED}>
                  <Msg id={localMessageIds.callerSelect.notassigned} />
                </MenuItem>
                <MenuItem value={CALLER_FILTER_MODE.PARTICIPATED}>
                  <Msg id={localMessageIds.callerSelect.participated} />
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
