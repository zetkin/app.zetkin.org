import { Box, Chip, MenuItem } from '@mui/material';
import { FormEvent, useState } from 'react';

import FilterForm from '../../FilterForm';
import StyledItemSelect from 'features/smartSearch/components/inputs/StyledItemSelect';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import useTags from 'features/tags/hooks/useTags';
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
  const { orgId } = useNumericRouteParams();
  const { data } = useTags(orgId);
  const tags = data || [];
  const tagsSorted = tags.sort((t1, t2) => {
    return t1.title.localeCompare(t2.title);
  });

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<PersonTagsFilterConfig>(initialFilter, {
      condition: CONDITION_OPERATOR.ALL,
      tags: [],
    });

  const [selected, setSelected] = useState<CONDITION_OPERATOR>(
    filter.config.condition
  );

  // preserve the order of the tag array
  const selectedTags = filter.config.tags.reduce((acc: ZetkinTag[], id) => {
    const tag = tagsSorted.find((tag) => tag.id === id);
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  // only submit if at least one tag has been added
  const submittable = !!filter.config.tags.length;

  // event handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleConditionChange = (conditionValue: string) => {
    if (conditionValue === CONDITION_OPERATOR.SOME) {
      setConfig({
        ...filter.config,
        condition: CONDITION_OPERATOR.SOME,
        min_matching: 1,
      });
    } else {
      setConfig({
        ...filter.config,
        condition: conditionValue as CONDITION_OPERATOR,
        min_matching: undefined,
      });
    }
    setSelected(conditionValue as CONDITION_OPERATOR);
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
    </StyledSelect>
  );

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
            condition:
              selected == 'some' ? (
                <Msg
                  id={localMessageIds.condition.edit.some}
                  values={{
                    conditionSelect,
                    minMatchingInput: (
                      <StyledNumberInput
                        inputProps={{
                          max: selectedTags.length,
                          min: '1',
                        }}
                        onChange={(e) =>
                          setConfig({
                            ...filter.config,
                            condition: CONDITION_OPERATOR.SOME,
                            min_matching: +e.target.value || undefined,
                          })
                        }
                        value={filter.config.min_matching}
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
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default PersonTags;
