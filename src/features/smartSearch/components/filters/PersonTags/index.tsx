import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Chip, MenuItem } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import getTags from 'features/tags/api/getTags';
import StyledItemSelect from 'features/smartSearch/components/inputs/StyledItemSelect';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import { ZetkinTag } from 'utils/types/zetkin';
import {
  CONDITION_OPERATOR,
  NewSmartSearchFilter,
  OPERATION,
  PersonTagsFilterConfig,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.personTags;

const MIN_MATCHING = 'min_matching';

interface PersonTagsProps {
  filter:
    | SmartSearchFilterWithId<PersonTagsFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<PersonTagsFilterConfig>
      | ZetkinSmartSearchFilter<PersonTagsFilterConfig>
  ) => void;
  onCancel: () => void;
}

const PersonTags = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: PersonTagsProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const tagsQuery = useQuery(['tags', orgId], getTags(orgId as string));
  const tags = tagsQuery?.data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<PersonTagsFilterConfig>(initialFilter, {
      condition: CONDITION_OPERATOR.ALL,
      tags: [],
    });

  //keep minMatching in state so last value is saved even when removed from config
  const [minMatching, setMinMatching] = useState(
    filter.config.min_matching || 1
  );

  useEffect(() => {
    if (filter.config.condition === CONDITION_OPERATOR.ANY) {
      setConfig({ ...filter.config, min_matching: minMatching });
    }
  }, [minMatching]);

  // preserve the order of the tag array
  const selectedTags = filter.config.tags.reduce((acc: ZetkinTag[], id) => {
    const tag = tags.find((tag) => tag.id === id);
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  const selected = filter.config.min_matching
    ? MIN_MATCHING
    : filter.config.condition;

  // only submit if at least one tag has been added
  const submittable = !!filter.config.tags.length;

  // event handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleConditionChange = (conditionValue: string) => {
    if (conditionValue === MIN_MATCHING) {
      setConfig({
        ...filter.config,
        condition: CONDITION_OPERATOR.ANY,
        min_matching: minMatching,
      });
    } else {
      setConfig({
        ...filter.config,
        condition: conditionValue as CONDITION_OPERATOR,
        min_matching: undefined,
      });
    }
  };

  const handleTagChange = (tags: { id: number; title: string }[]) => {
    setConfig({ ...filter.config, tags: tags.map((t) => t.id) });
  };

  const handleTagDelete = (tag: ZetkinTag) => {
    setConfig({
      ...filter.config,
      tags: filter.config.tags.filter((t) => t !== tag.id),
    });
  };

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
    </StyledSelect>
  );

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
            condition:
              selected == 'min_matching' ? (
                <Msg
                  id={localMessageIds.condition.edit.minMatching}
                  values={{
                    conditionSelect,
                    minMatchingInput: (
                      <StyledNumberInput
                        inputProps={{
                          max: filter.config.tags.length,
                          min: '1',
                        }}
                        onChange={(e) => setMinMatching(+e.target.value)}
                        value={minMatching}
                      />
                    ),
                  }}
                />
              ) : (
                <Msg
                  id={localMessageIds.condition.edit[selected]}
                  values={{ conditionSelect }}
                />
              ),
            tags: (
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
                    onChange={(_, v) => handleTagChange(v)}
                    options={tags.map((t) => ({
                      id: t.id,
                      title: t.title,
                    }))}
                    value={tags.filter((t) =>
                      filter.config.tags.includes(t.id)
                    )}
                  />
                )}
              </Box>
            ),
          }}
        />
      )}
    />
  );
};

export default PersonTags;
