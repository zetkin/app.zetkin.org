import { MenuItem } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import StyledSelect from '../../inputs/StyledSelect';
import StyledTextInput from '../../inputs/StyledTextInput';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  DATA_FIELD,
  Gender,
  NewSmartSearchFilter,
  OPERATION,
  PersonDataFilterConfig,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.personData;

// set default select option
const REMOVE_FIELD = 'none';

interface PersonDataProps {
  filter:
    | SmartSearchFilterWithId<PersonDataFilterConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<PersonDataFilterConfig>
      | ZetkinSmartSearchFilter<PersonDataFilterConfig>
  ) => void;
  onCancel: () => void;
}

interface Criterion {
  field: DATA_FIELD;
  value: string;
}

const PersonData = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: PersonDataProps): JSX.Element => {
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<PersonDataFilterConfig>(initialFilter, {
      fields: { first_name: '' },
    });

  const ALL_FIELDS = Object.values(DATA_FIELD);
  const ALL_FIELDS_SORTED = ALL_FIELDS.sort((af1, af2) => {
    return af1.localeCompare(af2);
  });

  // check which fields are present in the filter config, and load their key-value pairs into an array
  const initialCriteria = ALL_FIELDS_SORTED.filter(
    (f) => f in filter.config.fields
  ).map((f) => ({ field: f, value: filter.config.fields[f] || '' }));

  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);

  // check that there are no blank fields before submitting
  const submittable = criteria.every((c) => c.value.length);

  const currentFields = criteria.map((c) => c.field);

  useEffect(() => {
    const fields = criteria.reduce((acc, c) => {
      return { ...acc, [c.field]: c.value };
    }, {});
    setConfig({
      ...filter.config,
      fields,
    });
  }, [criteria]);

  const addCriteria = (field: string) => {
    if (field !== REMOVE_FIELD) {
      setCriteria([...criteria, { field: field as DATA_FIELD, value: '' }]);
    }
  };

  // event handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleValueChange = (value: string, c: Criterion) => {
    setCriteria(
      criteria.map((criterion) => {
        return criterion.field === c.field
          ? { ...criterion, value }
          : criterion;
      })
    );
  };

  const handleSelectChange = (field: string, c: Criterion) => {
    if (field === REMOVE_FIELD) {
      setCriteria(criteria.filter((criterion) => criterion.field !== c.field));
    } else {
      let value = c.value;
      // Default value for gender is 'f'
      if (field === DATA_FIELD.GENDER) {
        value = 'f';
      }

      // It doesn't make sense to use the gender value when changing to other fields
      if (c.field === DATA_FIELD.GENDER) {
        value = '';
      }
      setCriteria(
        criteria.map((criterion) => {
          return criterion.field === c.field
            ? { field: field as DATA_FIELD, value }
            : criterion;
        })
      );
    }
  };

  // message components
  const addRemoveSelect = (
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
      <MenuItem key={OPERATION.SUB} value={OPERATION.LIMIT}>
        <Msg id={messageIds.operators.limit} />
      </MenuItem>
    </StyledSelect>
  );

  const genders: Gender[] = ['f', 'm', 'o'];

  const getCriteriaString = () => {
    let existing;
    let criteriaString: JSX.Element | null = null;
    const globalOptions = ALL_FIELDS.filter((f) => !currentFields.includes(f));
    criteria.forEach((c) => {
      const options = [c.field].concat(globalOptions);
      existing = (
        <Msg
          id={localMessageIds.fieldMatches}
          values={{
            field: (
              <StyledSelect
                onChange={(e) => handleSelectChange(e.target.value, c)}
                value={c.field}
              >
                {criteria.length > 1 && (
                  <MenuItem key={REMOVE_FIELD} value={REMOVE_FIELD}>
                    <Msg id={localMessageIds.fieldSelect.remove} />
                  </MenuItem>
                )}
                {options.map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={localMessageIds.fieldSelect[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            value:
              c.field === DATA_FIELD.GENDER ? (
                <StyledSelect
                  onChange={(e) => {
                    handleValueChange(e.target.value, c);
                  }}
                  value={filter.config.fields.gender || 'f'}
                >
                  {genders.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      <Msg id={localMessageIds.genders[gender]} />
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : (
                <StyledTextInput
                  inputString={c.value} // for dynamic width
                  onChange={(e) => handleValueChange(e.target.value, c)}
                  value={c.value}
                />
              ),
          }}
        />
      );
      if (criteriaString) {
        criteriaString = (
          <Msg
            id={localMessageIds.fieldTuple}
            values={{
              first: criteriaString,
              second: existing,
            }}
          />
        );
      } else {
        criteriaString = existing;
      }
    });
    return criteriaString;
  };

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
            addRemoveSelect,
            criteria: (
              <>
                {getCriteriaString()}
                {criteria.length < ALL_FIELDS.length && (
                  <StyledSelect
                    onChange={(e) => addCriteria(e.target.value)}
                    value={REMOVE_FIELD}
                  >
                    <MenuItem key={REMOVE_FIELD} value={REMOVE_FIELD}>
                      <Msg id={localMessageIds.ellipsis} />
                    </MenuItem>
                    {ALL_FIELDS.filter((f) => !currentFields.includes(f)).map(
                      (o) => (
                        <MenuItem key={o} value={o}>
                          <Msg id={localMessageIds.fieldSelect[o]} />
                        </MenuItem>
                      )
                    )}
                  </StyledSelect>
                )}
              </>
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default PersonData;
