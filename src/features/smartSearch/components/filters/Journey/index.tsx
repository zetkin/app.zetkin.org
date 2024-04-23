import { FC } from 'react';
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
import { Box, Chip, MenuItem, Typography } from '@mui/material';
import {
  CONDITION_OPERATOR,
  JourneyFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from '../../types';

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
      operator: 'opened',
    });
  const { data } = useTags(orgId);
  const tags = data || [];
  const journeys = useJourneys(orgId).data || [];

  const MIN_MATCHING = 'min_matching';
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
    if (conditionValue === MIN_MATCHING) {
      setConfig({
        ...filter.config,
        tags: {
          condition: CONDITION_OPERATOR.ANY,
          ids: [],
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
          condition: conditionValue as CONDITION_OPERATOR,
          ids: [],
          min_matching: undefined,
        },
      });
    }
  };
  const selected = !filter.config.tags
    ? REGARDLESS_TAGS
    : filter.config.tags.min_matching
    ? MIN_MATCHING
    : filter.config.tags.condition;

  const notRegardlessTags = !!filter.config.tags;

  const conditionSelect = (
    <StyledSelect
      onChange={(e) => handleConditionChange(e.target.value)}
      value={selected}
    >
      {Object.values(CONDITION_OPERATOR).map((o) => (
        <MenuItem key={o} value={o}>
          <Msg id={localMessageIds.condition.conditionSelect[o]} />
        </MenuItem>
      ))}
      <MenuItem key={MIN_MATCHING} value={MIN_MATCHING}>
        <Msg id={localMessageIds.condition.conditionSelect.minMatching} />
      </MenuItem>
      <MenuItem key={REGARDLESS_TAGS} value={REGARDLESS_TAGS}>
        <Msg id={localMessageIds.condition.conditionSelect.regardlessTags} />
      </MenuItem>
    </StyledSelect>
  );

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
            condition: (
              <>
                {conditionSelect}
                {selected === 'min_matching' && (
                  <>
                    <StyledNumberInput
                      inputProps={{
                        max: filter.config.tags!.ids.length,
                        min: '1',
                      }}
                      onChange={(e) =>
                        setConfig({
                          ...filter.config,
                          tags: {
                            condition: CONDITION_OPERATOR.ANY,
                            ids: filter.config.tags!.ids,
                            min_matching: +e.target.value,
                          },
                        })
                      }
                      sx={{ ml: '0.5rem' }}
                      value={filter.config.tags?.min_matching}
                    />
                    <Typography
                      component="span"
                      sx={{ ml: '0.5rem' }}
                      variant="h4"
                    >
                      <Msg id={localMessageIds.of} />
                    </Typography>
                  </>
                )}
              </>
            ),
            has: notRegardlessTags ? <Msg id={localMessageIds.has} /> : null,
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
