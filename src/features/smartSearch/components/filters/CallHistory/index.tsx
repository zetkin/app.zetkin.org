import { FormEvent } from 'react';
import { Box, MenuItem, Tooltip } from '@mui/material';

import FilterForm from '../../FilterForm';
import { Msg } from 'core/i18n';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import { truncateOnMiddle } from 'utils/stringUtils';
import useCallAssignments from 'features/callAssignments/hooks/useCallAssignments';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  CALL_OPERATOR,
  CallHistoryFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
const localMessageIds = messageIds.filters.callHistory;

const ANY_ASSIGNMENT = 'any';

interface CallHistoryProps {
  filter:
    | SmartSearchFilterWithId<CallHistoryFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<CallHistoryFilterConfig>
      | ZetkinSmartSearchFilter<CallHistoryFilterConfig>
  ) => void;
  onCancel: () => void;
}

const CallHistory = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: CallHistoryProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const assignmentsFuture = useCallAssignments(orgId);
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<CallHistoryFilterConfig>(initialFilter, {
      minTimes: 1,
      operator: CALL_OPERATOR.CALLED,
    });

  // only submit if assignments exist
  const submittable = !!assignmentsFuture.data?.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    setConfig({
      assignment: filter.config.assignment,
      minTimes: filter.config.minTimes,
      operator: filter.config.operator,
      ...range,
    });
  };

  const handleAssignmentSelectChange = (assignmentValue: string) => {
    if (assignmentValue === ANY_ASSIGNMENT) {
      setConfig({ ...filter.config, assignment: undefined });
    } else {
      setConfig({ ...filter.config, assignment: +assignmentValue });
    }
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
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
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={messageIds.operators[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            assignmentSelect: (
              <StyledSelect
                onChange={(e) => handleAssignmentSelectChange(e.target.value)}
                SelectProps={{
                  renderValue: function getLabel(value) {
                    return value === ANY_ASSIGNMENT ? (
                      <Msg id={localMessageIds.assignmentSelect.any} />
                    ) : (
                      <Msg
                        id={localMessageIds.assignmentSelect.assignment}
                        values={{
                          assignmentTitle: truncateOnMiddle(
                            assignmentsFuture.data?.find((a) => a.id === value)
                              ?.title ?? '',
                            40
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={filter.config.assignment || ANY_ASSIGNMENT}
              >
                {!assignmentsFuture.data?.length && (
                  <MenuItem key={ANY_ASSIGNMENT} value={ANY_ASSIGNMENT}>
                    <Msg id={localMessageIds.assignmentSelect.none} />
                  </MenuItem>
                )}
                {assignmentsFuture.data?.length && (
                  <MenuItem key={ANY_ASSIGNMENT} value={ANY_ASSIGNMENT}>
                    <Msg id={localMessageIds.assignmentSelect.any} />
                  </MenuItem>
                )}
                {assignmentsFuture.data?.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    <Tooltip
                      placement="right-start"
                      title={a.title.length >= 40 ? a.title : ''}
                    >
                      <Box>{truncateOnMiddle(a.title, 40)}</Box>
                    </Tooltip>
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            callSelect: (
              <StyledSelect
                onChange={(e) => {
                  const callOperator = e.target.value as CALL_OPERATOR;
                  if (callOperator == CALL_OPERATOR.NOTREACHED) {
                    setConfig({
                      ...filter.config,
                      minTimes: undefined,
                      operator: callOperator,
                    });
                  } else {
                    setConfig({
                      ...filter.config,
                      operator: callOperator,
                    });
                  }
                }}
                value={filter.config.operator}
              >
                {Object.values(CALL_OPERATOR).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={localMessageIds.callSelect[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            minTimes:
              filter.config.operator == CALL_OPERATOR.NOTREACHED ? null : (
                <Msg
                  id={localMessageIds.minTimesInput}
                  values={{
                    input: (
                      <StyledNumberInput
                        defaultValue={filter.config.minTimes || 1}
                        inputProps={{ min: '1' }}
                        onChange={(e) => {
                          setConfig({
                            ...filter.config,
                            minTimes: +e.target.value,
                          });
                        }}
                      />
                    ),
                    minTimes: filter.config.minTimes || 1,
                  }}
                />
              ),
            timeFrame: (
              <TimeFrame
                filterConfig={{
                  after: filter.config.after,
                  before: filter.config.before,
                }}
                onChange={handleTimeFrameChange}
                options={[
                  TIME_FRAME.EVER,
                  TIME_FRAME.AFTER_DATE,
                  TIME_FRAME.BEFORE_DATE,
                  TIME_FRAME.BETWEEN,
                  TIME_FRAME.LAST_FEW_DAYS,
                  TIME_FRAME.BEFORE_TODAY,
                ]}
              />
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default CallHistory;
