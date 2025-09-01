import { FC, useState } from 'react';
import { Chip, MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import {
  AllInSuborgFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from '../../types';
import StyledSelect from '../../inputs/StyledSelect';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import StyledItemSelect from '../../inputs/StyledItemSelect';

type Props = {
  filter:
    | SmartSearchFilterWithId<AllInSuborgFilterConfig>
    | NewSmartSearchFilter;
  onCancel: () => void;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<AllInSuborgFilterConfig>
      | ZetkinSmartSearchFilter<AllInSuborgFilterConfig>
  ) => void;
};

const AllInSuborg: FC<Props> = ({
  filter: initialFilter,
  onSubmit,
  onCancel,
}) => {
  const { orgId } = useNumericRouteParams();
  const suborgs = useSubOrganizations(orgId).data || [];

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<AllInSuborgFilterConfig>(initialFilter, {
      organizations: 'suborgs',
    });

  const organizationsConfig = filter.config.organizations;
  const organizationsConfigIsArray = Array.isArray(organizationsConfig);

  let initialScope: 'any' | 'single' | 'multiple' = 'any';
  if (organizationsConfigIsArray) {
    if (organizationsConfig.length == 1) {
      initialScope = 'single';
    } else {
      initialScope = 'multiple';
    }
  }

  const [scope, setScope] = useState<'any' | 'single' | 'multiple'>(
    initialScope
  );

  const activeSuborgs = suborgs
    .filter((suborg) => suborg.id != orgId)
    .filter((suborg) => suborg.is_active)
    .sort((a, b) => a.title.localeCompare(b.title));

  const selectedSuborgs = activeSuborgs.filter(
    (suborg) =>
      organizationsConfigIsArray && organizationsConfig.includes(suborg.id)
  );

  const addRemoveSelect = (
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
  );

  const suborgScopeSelect = (
    <StyledSelect
      onChange={(e) => {
        const newValue = e.target.value as 'any' | 'single' | 'multiple';
        setScope(newValue);

        setConfig({
          ...filter.config,
          organizations: newValue == 'any' ? 'suborgs' : [],
        });
      }}
      value={scope}
    >
      <MenuItem value="any">
        <Msg id={messageIds.filters.allInSuborg.suborgScopeSelect.any} />
      </MenuItem>
      <MenuItem value="single">
        <Msg id={messageIds.filters.allInSuborg.suborgScopeSelect.single} />
      </MenuItem>
      <MenuItem value="multiple">
        <Msg id={messageIds.filters.allInSuborg.suborgScopeSelect.multiple} />
      </MenuItem>
    </StyledSelect>
  );

  const singleSuborgSelect = (
    <StyledSelect
      defaultValue={selectedSuborgs[0]?.id}
      onChange={(ev) => {
        const selectedSuborgId = parseInt(ev.target.value);
        setConfig({
          ...filter.config,
          organizations: [selectedSuborgId],
        });
      }}
    >
      {activeSuborgs.map((suborg) => (
        <MenuItem
          key={suborg.id}
          disabled={
            organizationsConfigIsArray &&
            organizationsConfig.includes(suborg.id)
          }
          value={suborg.id}
        >
          {suborg.title}
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const multipleSuborgsSelect = (
    <>
      {selectedSuborgs.map((suborg) => {
        return (
          <Chip
            key={suborg.id}
            label={suborg.title}
            onDelete={() => {
              if (organizationsConfigIsArray) {
                setConfig({
                  ...filter.config,
                  organizations: organizationsConfig.filter(
                    (id) => id != suborg.id
                  ),
                });
              }
            }}
            style={{ margin: '3px' }}
            variant="outlined"
          />
        );
      })}
      {organizationsConfigIsArray &&
        organizationsConfig.length < activeSuborgs.length && (
          <StyledItemSelect
            getOptionDisabled={(item) =>
              selectedSuborgs.some((s) => s.id == item.id) || false
            }
            onChange={(_, items) => {
              const ids = items.map((item) => item.id);
              setConfig({
                ...filter.config,
                organizations: ids,
              });
            }}
            options={activeSuborgs.map((org) => ({
              id: org.id,
              title: org.title,
            }))}
            value={selectedSuborgs}
          />
        )}
    </>
  );

  return (
    <FilterForm
      onCancel={() => onCancel()}
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmit(filter);
      }}
      renderExamples={() => (
        <>
          <Msg id={messageIds.filters.allInSuborg.examples.one} />
          <br />
          <Msg id={messageIds.filters.allInSuborg.examples.two} />
        </>
      )}
      renderSentence={() => {
        if (scope == 'any') {
          return (
            <Msg
              id={messageIds.filters.allInSuborg.inputString.any}
              values={{
                addRemoveSelect,
                suborgScopeSelect,
              }}
            />
          );
        } else if (scope == 'single') {
          return (
            <Msg
              id={messageIds.filters.allInSuborg.inputString.single}
              values={{
                addRemoveSelect,
                singleSuborgSelect,
                suborgScopeSelect,
              }}
            />
          );
        } else {
          //Scope must be "multiple"
          return (
            <Msg
              id={messageIds.filters.allInSuborg.inputString.multiple}
              values={{
                addRemoveSelect,
                multipleSuborgsSelect,
                suborgScopeSelect,
              }}
            />
          );
        }
      }}
    />
  );
};

export default AllInSuborg;
