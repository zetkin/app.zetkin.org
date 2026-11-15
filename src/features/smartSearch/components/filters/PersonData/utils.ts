import {
  DATA_FIELD,
  PersonDataFilterConfig,
} from 'features/smartSearch/components/types';

/**
 * How a single field in the person_data filter is matched.
 *
 * The Zetkin API matches person_data values as case-insensitive substrings
 * (SQL ILIKE '%value%'). An empty string therefore matches every person who
 * has any value for that field, which is how "is set" is expressed.
 */
export enum DATA_FIELD_OPERATOR {
  MATCHES = 'matches',
  IS_SET = 'is_set',
}

export interface Criterion {
  field: DATA_FIELD;
  operator: DATA_FIELD_OPERATOR;
  value: string;
}

export type PersonDataFields = PersonDataFilterConfig['fields'];

/**
 * Fields that can not be used with the "is set" operator. Gender is an enum
 * and the API does not accept an empty value for it.
 */
const FIELDS_WITHOUT_IS_SET: DATA_FIELD[] = [DATA_FIELD.GENDER];

export function canUseIsSet(field: DATA_FIELD): boolean {
  return !FIELDS_WITHOUT_IS_SET.includes(field);
}

export function getOperatorsForField(field: DATA_FIELD): DATA_FIELD_OPERATOR[] {
  return canUseIsSet(field)
    ? [DATA_FIELD_OPERATOR.MATCHES, DATA_FIELD_OPERATOR.IS_SET]
    : [DATA_FIELD_OPERATOR.MATCHES];
}

/**
 * Criteria for a brand new filter, before the user has entered anything.
 */
export function getDefaultCriteria(): Criterion[] {
  return [
    {
      field: DATA_FIELD.FIRST_NAME,
      operator: DATA_FIELD_OPERATOR.MATCHES,
      value: '',
    },
  ];
}

/**
 * Convert the fields of a saved filter config into editable criteria,
 * sorted by field name. An empty string value means "is set".
 */
export function criteriaFromFields(fields: PersonDataFields): Criterion[] {
  return Object.values(DATA_FIELD)
    .sort((f1, f2) => f1.localeCompare(f2))
    .filter((field) => field in fields)
    .map((field) => {
      const value = fields[field] ?? '';
      if (value === '' && canUseIsSet(field)) {
        return { field, operator: DATA_FIELD_OPERATOR.IS_SET, value: '' };
      }
      return { field, operator: DATA_FIELD_OPERATOR.MATCHES, value };
    });
}

/**
 * Convert editable criteria into the fields of a filter config.
 */
export function fieldsFromCriteria(criteria: Criterion[]): PersonDataFields {
  return criteria.reduce<PersonDataFields>((fields, c) => {
    const value = c.operator === DATA_FIELD_OPERATOR.IS_SET ? '' : c.value;
    return { ...fields, [c.field]: value };
  }, {});
}

/**
 * A filter can be submitted when every "matches" criterion has a value.
 * "Is set" criteria never need a value.
 */
export function isSubmittable(criteria: Criterion[]): boolean {
  return criteria.every(
    (c) => c.operator === DATA_FIELD_OPERATOR.IS_SET || c.value.length > 0
  );
}
