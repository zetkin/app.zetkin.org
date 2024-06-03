import { FC } from 'react';
import { Box, Chip, MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledItemSelect from '../../inputs/StyledItemSelect';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';
import {
  JOURNEY_CONDITION_OP,
  JourneyFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from '../../types';

const localMessageIds = messageIds.filters.journey;

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
      tags: {
        condition: JOURNEY_CONDITION_OP.ALL,
        ids: [],
        min_matching: undefined,
      },
    });
  const { data } = useTags(orgId);
  const tags = data || [];
  const journeys = useJourneys(orgId).data || [];

  const REGARDLESS_TAGS = 'regardlessTags';

  // preserve the order of the tag array
  const selectedTags =
    filter.config.tags?.ids.reduce((acc: ZetkinTag[], id) => {
      const tag = tags.find((tag) => tag.id === id);
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    }, []) || [];

  const handleTagDelete = (tag: ZetkinTag) => {
    const tags = filter.config?.tags;
    if (tags) {
      setConfig({
        ...filter.config,
        tags: {
          condition: tags.condition,
          ids: tags.ids.filter((t) => t !== tag.id),
          min_matching: tags.min_matching,
        },
      });
    }
  };

  const handleConditionChange = (conditionValue: string) => {
    if (conditionValue === JOURNEY_CONDITION_OP.SOME) {
      setConfig({
        ...filter.config,
        tags: {
          condition: JOURNEY_CONDITION_OP.SOME,
          ids: filter.config.tags?.ids || [],
          min_matching: 1,
        },
      });
    } else if (conditionValue === REGARDLESS_TAGS) {
      setConfig({
        ...filter.config,
        tags: undefined,
      });
    } else {
      setConfig({
        ...filter.config,
        tags: {
          condition: conditionValue as JOURNEY_CONDITION_OP,
          ids: filter.config.tags?.ids || [],
          min_matching: undefined,
        },
      });
    }
  };
  const selected = !filter.config.tags
    ? REGARDLESS_TAGS
    : filter.config.tags.min_matching
    ? JOURNEY_CONDITION_OP.SOME
    : filter.config.tags.condition;

  const notRegardlessTags = !!filter.config.tags;

  const conditionSelect = (
    <StyledSelect
      onChange={(e) => handleConditionChange(e.target.value)}
      value={selected}
    >
      {Object.values(JOURNEY_CONDITION_OP).map((o) => (
        <MenuItem key={o} value={o}>
          <Msg id={localMessageIds.condition.conditionSelect[o]} />
        </MenuItem>
      ))}
      <MenuItem key={REGARDLESS_TAGS} value={REGARDLESS_TAGS}>
        <Msg id={localMessageIds.condition.conditionSelect.regardlessTags} />
      </MenuItem>
    </StyledSelect>
  );

  const state = filter.config.closed ? 'closed' : 'open';

  return (
    <FilterForm
      disableSubmit={
        !filter.config.journey ||
        (filter.config.tags?.ids.length === 0 && notRegardlessTags)
      }
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
            closedTimeFrame:
              state == 'closed' ? (
                <TimeFrame
                  filterConfig={{
                    after: filter.config.opened?.after,
                    before: filter.config.opened?.before,
                  }}
                  onChange={(range) => {
                    setConfig({
                      ...filter.config,
                      opened: {
                        after: range.after,
                        before: range.before,
                      },
                    });
                  }}
                  options={[
                    TIME_FRAME.EVER,
                    TIME_FRAME.AFTER_DATE,
                    TIME_FRAME.BEFORE_DATE,
                    TIME_FRAME.BETWEEN,
                    TIME_FRAME.LAST_FEW_DAYS,
                    TIME_FRAME.BEFORE_TODAY,
                  ]}
                />
              ) : null,
            condition: (
              <>
                {conditionSelect}
                {selected === JOURNEY_CONDITION_OP.SOME && (
                  <StyledNumberInput
                    inputProps={{
                      max: filter.config.tags!.ids.length,
                      min: '1',
                    }}
                    onChange={(e) =>
                      setConfig({
                        ...filter.config,
                        tags: {
                          condition: JOURNEY_CONDITION_OP.SOME,
                          ids: filter.config.tags!.ids,
                          min_matching: +e.target.value,
                        },
                      })
                    }
                    sx={{ ml: '0.5rem' }}
                    value={filter.config.tags?.min_matching}
                  />
                )}
              </>
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
                    {journey.plural_label}
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            openedTimeFrame: (
              <TimeFrame
                filterConfig={{
                  after: filter.config.opened?.after,
                  before: filter.config.opened?.before,
                }}
                onChange={(range) => {
                  setConfig({
                    ...filter.config,
                    opened: {
                      after: range.after,
                      before: range.before,
                    },
                  });
                }}
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
            stateSelect: (
              <StyledSelect
                onChange={(ev) => {
                  setConfig({
                    ...filter.config,
                    closed:
                      ev.target.value == 'open'
                        ? null
                        : filter.config.closed || {},
                  });
                }}
                value={state}
              >
                <MenuItem value="open">
                  <Msg id={localMessageIds.stateOptions.open} />
                </MenuItem>
                <MenuItem value="closed">
                  <Msg id={localMessageIds.stateOptions.closed} />
                </MenuItem>
              </StyledSelect>
            ),
            tags: notRegardlessTags ? (
              <Box
                alignItems="center"
                display="inline-flex"
                style={{ verticalAlign: 'middle' }}
              >
                {selectedTags.map((tag) => {
                  return (
                    <Chip
                      key={tag.id}
                      label={tag.title}
                      onDelete={() => handleTagDelete(tag)}
                      style={{ margin: '3px' }}
                      variant="outlined"
                    />
                  );
                })}
                {selectedTags.length < tags.length && (
                  <StyledItemSelect
                    getOptionDisabled={(t) =>
                      selectedTags.some((selected) => selected.id === t.id)
                    }
                    onChange={(_, value) =>
                      setConfig({
                        ...filter.config,
                        tags: {
                          condition: filter.config.tags!.condition,
                          ids: value.map((t) => t.id),
                          min_matching: filter.config.tags!.min_matching,
                        },
                      })
                    }
                    options={tags.map((t) => ({
                      id: t.id,
                      title: t.title,
                    }))}
                    value={tags.filter((t) =>
                      filter.config.tags!.ids.includes(t.id)
                    )}
                  />
                )}
              </Box>
            ) : null,
            tagsDesc: notRegardlessTags ? (
              <>
                <Msg id={localMessageIds.followingTags} /> :
              </>
            ) : null,
          }}
        />
      )}
    />
  );
};

export default Journey;
