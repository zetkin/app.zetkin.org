import { FC, useEffect, useState } from 'react';
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
  const [scope, setScope] = useState<'any' | 'single' | 'multiple'>('any');
  const [selectedSuborgIds, setSelectedSuborgIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedSuborgIds([]);
  }, [scope]);

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<AllInSuborgFilterConfig>(initialFilter, {
      organizations: 'suborgs',
    });

  const activeSuborgs = suborgs
    .filter((suborg) => suborg.id != orgId)
    .filter((suborg) => suborg.is_active)
    .sort((a, b) => a.title.localeCompare(b.title));

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

        if (newValue == 'any') {
          setConfig({
            ...filter.config,
            organizations: 'suborgs',
          });
        }
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
      onChange={(ev) => {
        const selectedSuborgId = parseInt(ev.target.value);
        setSelectedSuborgIds([selectedSuborgId]);
        setConfig({
          ...filter.config,
          organizations: [selectedSuborgId],
        });
      }}
    >
      {activeSuborgs.map((suborg) => (
        <MenuItem
          key={suborg.id}
          disabled={selectedSuborgIds.includes(suborg.id)}
          value={suborg.id}
        >
          {suborg.title}
        </MenuItem>
      ))}
    </StyledSelect>
  );

  const selectedSuborgs = activeSuborgs.filter((suborg) =>
    selectedSuborgIds.includes(suborg.id)
  );

  const multipleSuborgsSelect = (
    <>
      {selectedSuborgs.map((suborg) => {
        return (
          <Chip
            key={suborg.id}
            label={suborg.title}
            onDelete={() => {
              setSelectedSuborgIds(
                selectedSuborgIds.filter((id) => id != suborg.id)
              );
              setConfig({
                ...filter.config,
                organizations: selectedSuborgIds.filter(
                  (id) => id != suborg.id
                ),
              });
            }}
            style={{ margin: '3px' }}
            variant="outlined"
          />
        );
      })}
      {selectedSuborgIds.length < activeSuborgs.length && (
        <StyledItemSelect
          getOptionDisabled={(item) =>
            selectedSuborgIds.some((id) => id == item.id) || false
          }
          onChange={(_, items) => {
            const ids = items.map((item) => item.id);
            setSelectedSuborgIds(ids);
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
