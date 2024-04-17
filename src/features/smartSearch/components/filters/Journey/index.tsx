import FilterForm from '../../FilterForm';
import { MenuItem } from '@mui/material';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  CONDITION_OPERATOR,
  JourneyFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from '../../types';
import { FC, useEffect, useState } from 'react';

const localMessageIds = messageIds.filters.journey;

enum JOURNEY_OP {
  OPEN = 'opened',
  CLOSE = 'closed',
}
interface JourneyProps {
  filter: SmartSearchFilterWithId<JourneyFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<JourneyFilterConfig>
      | ZetkinSmartSearchFilter<JourneyFilterConfig>
  ) => void;
  onCancel: () => void;
}

const Journey: FC<JourneyProps> = ({
  filter: initialFilter,
  onSubmit,
  onCancel,
}) => {
  const { orgId } = useNumericRouteParams();
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<JourneyFilterConfig>(initialFilter, {
      condition: CONDITION_OPERATOR.ALL,
      operator: 'opened',
      tags: [],
    });

  const journeys = useJourneys(orgId).data || [];

  const MIN_MATCHING = 'min_matching';
  //keep minMatching in state so last value is saved even when removed from config
  const [minMatching, setMinMatching] = useState(filter.config.min_matching);

  useEffect(() => {
    if (filter.config.condition === CONDITION_OPERATOR.ANY) {
      setConfig({ ...filter.config, min_matching: minMatching });
    }
  }, [minMatching]);

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    setConfig({
      ...filter.config,
      after: range.after,
      before: range.before,
    });
  };

  const handleConditionChange = (conditionValue: string) => {
    if (conditionValue === MIN_MATCHING) {
      setConfig({
        ...filter.config,
        condition: CONDITION_OPERATOR.ANY,
        min_matching: 1,
      });
    } else {
      setConfig({
        ...filter.config,
        condition: conditionValue as CONDITION_OPERATOR,
        min_matching: undefined,
      });
    }
  };
  const selected = filter.config.min_matching
    ? MIN_MATCHING
    : filter.config.condition;

  const conditionSelect = (
    <StyledSelect
      onChange={(e) => handleConditionChange(e.target.value)}
      value={selected}
    >
      {Object.values(CONDITION_OPERATOR).map((o) => (
        <MenuItem key={o} value={o}>
          <Msg
            id={messageIds.filters.personTags.condition.conditionSelect[o]}
          />
        </MenuItem>
      ))}
      <MenuItem key={MIN_MATCHING} value={MIN_MATCHING}>
        <Msg
          id={
            messageIds.filters.personTags.condition.conditionSelect.minMatching
          }
        />
      </MenuItem>
    </StyledSelect>
  );

  return (
    <FilterForm
      disableSubmit={!filter.config.journey}
      onCancel={onCancel}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filter);
      }}
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
            condition:
              selected == 'min_matching' ? (
                <Msg
                  id={messageIds.filters.personTags.condition.edit.minMatching}
                  values={{
                    conditionSelect,
                    minMatchingInput: (
                      <StyledNumberInput
                        inputProps={{
                          max: filter.config.tags.length,
                          min: '1',
                        }}
                        onChange={(e) => setMinMatching(+e.target.value)}
                        value={filter.config.min_matching}
                      />
                    ),
                  }}
                />
              ) : (
                <Msg
                  id={messageIds.filters.personTags.condition.edit[selected]}
                  values={{ conditionSelect }}
                />
              ),
            journeySelect: (
              <StyledSelect
                minWidth="10rem"
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    journey: parseInt(e.target.value),
                  })
                }
                value={filter.config.journey || ''}
              >
                {journeys.map((journey) => (
                  <MenuItem key={`journey-${journey.id}`} value={journey.id}>
                    {`"${journey.title}"`}
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            operator: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    operator: e.target.value as JOURNEY_OP,
                  })
                }
                value={filter.config.operator}
              >
                <MenuItem value={JOURNEY_OP.OPEN}>
                  <Msg id={localMessageIds.opened} />
                </MenuItem>
                <MenuItem value={JOURNEY_OP.CLOSE}>
                  <Msg id={localMessageIds.closed} />
                </MenuItem>
              </StyledSelect>
            ),
            statusText: (
              <Msg
                id={
                  filter.config.operator === 'opened'
                    ? localMessageIds.thatOpened
                    : localMessageIds.thatFinished
                }
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
    />
  );
};

export default Journey;
