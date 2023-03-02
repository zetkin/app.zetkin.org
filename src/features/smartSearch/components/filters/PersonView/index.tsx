import { FormEvent } from 'react';
import { MenuItem } from '@material-ui/core';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import FilterForm from '../../FilterForm';
import getViews from 'features/smartSearch/fetching/getViews';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  IN_OPERATOR,
  NewSmartSearchFilter,
  OPERATION,
  PersonViewFilterConfig,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.personView;

interface PersonViewProps {
  filter:
    | SmartSearchFilterWithId<PersonViewFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<PersonViewFilterConfig>
      | ZetkinSmartSearchFilter<PersonViewFilterConfig>
  ) => void;
  onCancel: () => void;
}

const PersonView = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: PersonViewProps): JSX.Element => {
  const { orgId } = useRouter().query;

  const personViewsQuery = useQuery(
    ['personviews', orgId],
    getViews(orgId as string)
  );
  const personViews = personViewsQuery?.data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<PersonViewFilterConfig>(initialFilter, {
      operator: IN_OPERATOR.IN,
      view: 0,
    });

  const submittable = !!(filter.config.view > 0 && filter.config.operator);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (filter.config.view && filter.config.operator) {
      onSubmit(filter);
    }
  };

  const handleViewChange = (view: number) => {
    setConfig({
      ...filter.config,
      view: view,
    });
  };

  const handleInOperatorChange = (operator: IN_OPERATOR) => {
    setConfig({
      ...filter.config,
      operator: operator,
    });
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
      renderSentence={() =>
        personViews.length ? (
          <Msg
            id={localMessageIds.inputString}
            values={{
              addRemoveSelect: (
                <StyledSelect
                  onChange={(e) => setOp(e.target.value as OPERATION)}
                  value={filter.op}
                >
                  <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                    <Msg id={localMessageIds.addRemoveSelect.add} />
                  </MenuItem>
                  <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                    <Msg id={localMessageIds.addRemoveSelect.sub} />
                  </MenuItem>
                </StyledSelect>
              ),
              inSelect: (
                <StyledSelect
                  onChange={(e) =>
                    handleInOperatorChange(e.target.value as IN_OPERATOR)
                  }
                  value={filter.config.operator}
                >
                  <MenuItem key={IN_OPERATOR.IN} value={IN_OPERATOR.IN}>
                    <Msg id={localMessageIds.inSelect.in} />
                  </MenuItem>
                  <MenuItem key={IN_OPERATOR.NOTIN} value={IN_OPERATOR.NOTIN}>
                    <Msg id={localMessageIds.inSelect.notin} />
                  </MenuItem>
                </StyledSelect>
              ),
              viewSelect: (
                <StyledSelect
                  onChange={(e) => handleViewChange(+e.target.value as number)}
                  value={filter.config.view}
                >
                  {personViews.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.title}
                    </MenuItem>
                  ))}
                </StyledSelect>
              ),
            }}
          />
        ) : (
          <Msg id={localMessageIds.viewSelect.none} />
        )
      }
    />
  );
};

export default PersonView;
