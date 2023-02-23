import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import getViews from 'features/smartSearch/fetching/getViews';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  NewSmartSearchFilter,
  OPERATION,
  IN_OPERATOR,
  PersonViewFilterConfig,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import { ZetkinView } from 'utils/types/zetkin';

const NO_VIEW_SELECTED = 'none';

interface PersonViewProps {
  filter: SmartSearchFilterWithId<PersonViewFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<PersonViewFilterConfig>
      | ZetkinSmartSearchFilter<PersonViewFilterConfig>
  ) => void;
  onCancel: () => void;
}

interface InternalConfig {
  view?: ZetkinView;
  operator?: IN_OPERATOR;
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
    useSmartSearchFilter<PersonViewFilterConfig>(initialFilter);
  console.log('Config');
  console.log(filter);

  useEffect(() => {
    console.log('UseEffect triggered');
    console.log(personViews);
    if (personViews.length) {
      console.log('Update config');
      console.log(filter);
      setConfig({
        operator: filter.config.operator || IN_OPERATOR.IN,
        view: filter.config.view || personViews[0].id,
      });
      console.log('config updated');
      console.log(filter);
    }
  }, [personViews]);

  const submittable = !!(filter.config.view != null && filter.config.operator);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (filter.config.view && filter.config.operator) {
      onSubmit({
        ...filter,
        config: {
          view: filter.config.view,
          operator: filter.config.operator,
        },
      });
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
          <Msg id="misc.smartSearch.person_view.examples.one" />
          <br />
          <Msg id="misc.smartSearch.person_view.examples.two" />
        </>
      )}
      renderSentence={() => (!!personViews.length ?
        <Msg
          id="misc.smartSearch.person_view.inputString"
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                  <Msg id="misc.smartSearch.person_view.addRemoveSelect.add" />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id="misc.smartSearch.person_view.addRemoveSelect.sub" />
                </MenuItem>
              </StyledSelect>
            ),
            inSelect: (
              <StyledSelect
                  onChange={(e) => handleInOperatorChange(e.target.value as IN_OPERATOR)}
                  value={filter.config.operator}
                >
                <MenuItem key={IN_OPERATOR.IN} value={IN_OPERATOR.IN}>
                  <Msg id="misc.smartSearch.person_view.inSelect.in" />
                </MenuItem>
                <MenuItem key={IN_OPERATOR.NOTIN} value={IN_OPERATOR.NOTIN}>
                  <Msg id="misc.smartSearch.person_view.inSelect.notin" />
                </MenuItem>
              </StyledSelect>
            ),
            viewSelect: ( 
              <StyledSelect
                  onChange={(e) => handleViewChange(+e.target.value as number)}
                  value={filter.config.view}
                >
                  {
                    personViews.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        { v.title }
                      </MenuItem>
                    ))
                  }
              </StyledSelect>
            ),
          }}
        /> : <Msg id="misc.smartSearch.person_view.viewSelect.none" />
      )}
    />
  )
};

export default PersonView;
