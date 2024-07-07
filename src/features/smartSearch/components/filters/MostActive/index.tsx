import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  MostActiveFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.mostActive;

interface MostActiveProps {
  filter:
    | SmartSearchFilterWithId<MostActiveFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<MostActiveFilterConfig>
      | ZetkinSmartSearchFilter<MostActiveFilterConfig>
  ) => void;
  onCancel: () => void;
}

const MostActive = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: MostActiveProps): JSX.Element => {
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<MostActiveFilterConfig>(initialFilter, {
      size: 20,
    });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    // Add time frame to config
    setConfig({
      size: filter.config.size,
      ...range,
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
            numPeople: filter.config?.size,
            numPeopleSelect: (
              <StyledNumberInput
                defaultValue={filter.config?.size}
                inputProps={{ min: '1' }}
                onChange={(e) => {
                  setConfig({
                    ...filter.config,
                    size: +e.target.value,
                  });
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
              />
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default MostActive;
