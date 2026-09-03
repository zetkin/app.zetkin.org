import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';

import LoggedCallCount from './LoggedCallCount';
import FilterForm from '../../FilterForm';
import { Msg, useMessages } from 'core/i18n';
import StyledAutocomplete from '../../inputs/StyledAutocomplete';
import StyledSelect from '../../inputs/StyledSelect';
import useCallAssignments from 'features/callAssignments/hooks/useCallAssignments';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  CallerParticipationFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';

const localMessageIds = messageIds.filters.callerParticipation;

const ANY_ASSIGNMENT = 'any';

interface CallerParticipationProps {
  filter:
    | SmartSearchFilterWithId<CallerParticipationFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<CallerParticipationFilterConfig>
      | ZetkinSmartSearchFilter<CallerParticipationFilterConfig>
  ) => void;
  onCancel: () => void;
}

const CallerParticipation = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: CallerParticipationProps): JSX.Element => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const assignmentsFuture = useCallAssignments(orgId);
  const assignments = assignmentsFuture.data || [];
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<CallerParticipationFilterConfig>(initialFilter, {
      assignment: null,
      num_calls: {
        min: 1,
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...filter,
      config: {
        assignment: filter.config.assignment,
        num_calls: filter.config.num_calls,
        organizations: filter.config.organizations,
      },
    });
  };

  const handleAssignmentSelectChange = (assignmentValue: string) => {
    if (assignmentValue === ANY_ASSIGNMENT) {
      setConfig({ ...filter.config, assignment: null });
    } else {
      setConfig({ ...filter.config, assignment: +assignmentValue });
    }
  };

  const handleCallCountChange = (callCount: { max?: number; min?: number }) => {
    setConfig({
      ...filter.config,
      num_calls: callCount,
    });
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
                    label:
                      messages.filters.callerParticipation.assignmentSelect.any(),
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
            callCountSelect: (
              <LoggedCallCount
                filterConfig={filter.config.num_calls}
                onChange={handleCallCountChange}
              />
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default CallerParticipation;
