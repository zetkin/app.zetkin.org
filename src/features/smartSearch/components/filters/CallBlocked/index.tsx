import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import FilterForm from '../../FilterForm';
import getAllCallAssignments from 'features/callAssignments/api/getAllCallAssignments';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  CallBlockedFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.callBlocked;

interface CallBlockedProps {
  filter:
    | SmartSearchFilterWithId<CallBlockedFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<CallBlockedFilterConfig>
      | ZetkinSmartSearchFilter<CallBlockedFilterConfig>
  ) => void;
  onCancel: () => void;
}

const CallBlocked = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: CallBlockedProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const assignmentsQuery = useQuery(
    ['assignments', orgId],
    getAllCallAssignments(orgId as string)
  );
  const assignments = assignmentsQuery?.data || [];
  const { filter, setOp } = useSmartSearchFilter<CallBlockedFilterConfig>(
    initialFilter,
    {
      reason: 'any',
    }
  );

  // only submit if assignments exist
  const submittable = !!assignments.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
      onCancel={onCancel}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => <></>}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={messageIds.operators[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
          }}
        />
      )}
    />
  );
};

export default CallBlocked;
