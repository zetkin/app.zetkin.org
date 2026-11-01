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
import {
  canUseIsSet,
  Criterion,
  criteriaFromFields,
  DATA_FIELD_OPERATOR,
  fieldsFromCriteria,
  getDefaultCriteria,
  getOperatorsForField,
  isSubmittable,
} from './utils';
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

  // A saved filter is loaded from its config. A new filter starts with an
  // empty "first name matches" criterion, which must not be read as "is set".
  const [criteria, setCriteria] = useState<Criterion[]>(() =>
    'config' in initialFilter
      ? criteriaFromFields(initialFilter.config.fields)
      : getDefaultCriteria()
  );

  const submittable = isSubmittable(criteria);

  const currentFields = criteria.map((c) => c.field);

  useEffect(() => {
    setConfig({
      ...filter.config,
      fields: fieldsFromCriteria(criteria),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria]);

  const addCriteria = (field: string) => {
    if (field !== REMOVE_FIELD) {
      setCriteria([
        ...criteria,
        {
          field: field as DATA_FIELD,
          operator: DATA_FIELD_OPERATOR.MATCHES,
          value: '',
        },
      ]);
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

  const handleOperatorChange = (
    operator: DATA_FIELD_OPERATOR,
    c: Criterion
  ) => {
    setCriteria(
      criteria.map((criterion) =>
        criterion.field === c.field ? { ...criterion, operator } : criterion
      )
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
      // Keep the operator unless the new field does not support it
      const operator = canUseIsSet(field as DATA_FIELD)
        ? c.operator
        : DATA_FIELD_OPERATOR.MATCHES;

      setCriteria(
        criteria.map((criterion) => {
          return criterion.field === c.field
            ? { field: field as DATA_FIELD, operator, value }
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
      const operators = getOperatorsForField(c.field);
      existing = (
        <Msg
          id={localMessageIds.fieldCondition}
          values={{
            field: (
              <StyledSelect
                data-testid={`PersonData-fieldSelect-${c.field}`}
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
            operator:
              operators.length > 1 ? (
                <StyledSelect
                  data-testid={`PersonData-operatorSelect-${c.field}`}
                  onChange={(e) =>
                    handleOperatorChange(
                      e.target.value as DATA_FIELD_OPERATOR,
                      c
                    )
                  }
                  value={c.operator}
                >
                  {operators.map((op) => (
                    <MenuItem key={op} value={op}>
                      <Msg id={localMessageIds.operatorSelect[op]} />
                    </MenuItem>
                  ))}
                </StyledSelect>
              ) : (
                <Msg id={localMessageIds.operatorSelect.matches} />
              ),
            value:
              c.operator === DATA_FIELD_OPERATOR.IS_SET ? (
                ''
              ) : c.field === DATA_FIELD.GENDER ? (
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
                  data-testid={`PersonData-valueInput-${c.field}`}
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
          <br />
          <Msg id={localMessageIds.examples.three} />
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
