import { MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import getAllCallAssignments from 'features/callAssignments/api/getAllCallAssignments';
import getStandaloneQueries from 'utils/fetching/getStandaloneQueries';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  IN_OPERATOR,
  NewSmartSearchFilter,
  OPERATION,
  QUERY_TYPE,
  SmartSearchFilterWithId,
  SubQueryFilterConfig,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.subQuery;

const NO_QUERY_SELECTED = 'none';

interface SubQueryProps {
  filter: SmartSearchFilterWithId<SubQueryFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<SubQueryFilterConfig>
      | ZetkinSmartSearchFilter<SubQueryFilterConfig>
  ) => void;
  onCancel: () => void;
}

const SubQuery = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: SubQueryProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const standaloneQuery = useQuery(
    ['standaloneQueries', orgId],
    getStandaloneQueries(orgId as string)
  );
  const standaloneQueries = standaloneQuery?.data || [];
  const assignmentsQuery = useQuery(
    ['assignments', orgId],
    getAllCallAssignments(orgId as string)
  );
  const assignments = assignmentsQuery?.data || [];

  const targetGroupQueriesWithTitles: ZetkinQuery[] = assignments.map((a) => ({
    ...a.target,
    title: a.title,
  }));

  const purposeGroupQueriesWithTitles: ZetkinQuery[] = assignments.map((a) => ({
    ...a.goal,
    title: a.title,
  }));

  const queries = [
    ...standaloneQueries,
    ...targetGroupQueriesWithTitles,
    ...purposeGroupQueriesWithTitles,
  ];

  const { filter, setOp } =
    useSmartSearchFilter<SubQueryFilterConfig>(initialFilter);

  const [selectedQuery, setSelectedQuery] = useState<ZetkinQuery>();
  const [operator, setOperator] = useState<IN_OPERATOR>(IN_OPERATOR.IN);

  useEffect(() => {
    if (queries.length) {
      setSelectedQuery(
        queries.find((q) => q.id === filter.config.query_id) || queries[0]
      );
    }
  }, [standaloneQueries, assignments]);

  const renderedOptions = queries.filter((q) => q.type === selectedQuery?.type);

  const submittable = !!queries.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedQuery) {
      onSubmit({
        ...filter,
        config: {
          operator: operator,
          query_id: selectedQuery.id,
        },
      });
    }
  };

  const handleTypeChange = (type: QUERY_TYPE) => {
    //try and find a title match first when switching between target and purpose types
    let newQuery = queries.find(
      (q) => q.type === type && selectedQuery?.title === q.title
    );
    if (!newQuery) {
      newQuery = queries.find((q) => q.type === type);
    }
    setSelectedQuery(newQuery);
  };

  const handleOptionChange = (option: number) => {
    const newQuery = queries.find((q) => q.id === option);
    setSelectedQuery(newQuery);
  };

  const handleMatchOperatorChange = (operator: IN_OPERATOR) => {
    setOperator(operator);
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
      onCancel={onCancel}
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
                    <Msg id={localMessageIds.addRemoveSelect[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            matchSelect: (
              <StyledSelect
                onChange={(e) =>
                  handleMatchOperatorChange(e.target.value as IN_OPERATOR)
                }
                value={operator || IN_OPERATOR.IN}
              >
                <MenuItem key={IN_OPERATOR.IN} value={IN_OPERATOR.IN}>
                  <Msg id={messageIds.filters.subQuery.matchSelect.in} />
                </MenuItem>
                <MenuItem key={IN_OPERATOR.NOTIN} value={IN_OPERATOR.NOTIN}>
                  <Msg id={messageIds.filters.subQuery.matchSelect.notin} />
                </MenuItem>
              </StyledSelect>
            ),
            query: !selectedQuery ? (
              <Msg
                id={localMessageIds.query.edit.none}
                values={{
                  querySelect: (
                    <StyledSelect
                      SelectProps={{
                        renderValue: function getLabel() {
                          return (
                            <Msg id={localMessageIds.query.selectLabel.none} />
                          );
                        },
                      }}
                      value={NO_QUERY_SELECTED}
                    >
                      <MenuItem
                        key={NO_QUERY_SELECTED}
                        value={NO_QUERY_SELECTED}
                      >
                        <Msg id={localMessageIds.query.selectOptions.none} />
                      </MenuItem>
                    </StyledSelect>
                  ),
                  titleSelect: <></>, // Not actually used, but required for interface consistency
                }}
              />
            ) : (
              <Msg
                id={localMessageIds.query.edit[selectedQuery.type || 'none']}
                values={{
                  querySelect: (
                    <StyledSelect
                      onChange={(e) =>
                        handleTypeChange(e.target.value as QUERY_TYPE)
                      }
                      SelectProps={{
                        renderValue: function getLabel(value) {
                          return (
                            <Msg
                              id={
                                localMessageIds.query.selectLabel[
                                  value as QUERY_TYPE
                                ]
                              }
                            />
                          );
                        },
                      }}
                      value={selectedQuery.type}
                    >
                      {standaloneQueries.length && (
                        <MenuItem
                          key={QUERY_TYPE.STANDALONE}
                          value={QUERY_TYPE.STANDALONE}
                        >
                          <Msg
                            id={localMessageIds.query.selectOptions.standalone}
                          />
                        </MenuItem>
                      )}
                      {targetGroupQueriesWithTitles.length && (
                        <MenuItem
                          key={QUERY_TYPE.TARGET}
                          value={QUERY_TYPE.TARGET}
                        >
                          <Msg
                            id={
                              localMessageIds.query.selectOptions
                                .callassignment_target
                            }
                          />
                        </MenuItem>
                      )}
                      {purposeGroupQueriesWithTitles.length && (
                        <MenuItem
                          key={QUERY_TYPE.PURPOSE}
                          value={QUERY_TYPE.PURPOSE}
                        >
                          <Msg
                            id={
                              localMessageIds.query.selectOptions
                                .callassignment_goal
                            }
                          />
                        </MenuItem>
                      )}
                    </StyledSelect>
                  ),
                  titleSelect: (
                    <StyledSelect
                      onChange={(e) => handleOptionChange(+e.target.value)}
                      value={selectedQuery.id}
                    >
                      {renderedOptions.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                          {o.title}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  ),
                }}
              />
            ),
          }}
        />
      )}
    />
  );
};

export default SubQuery;
