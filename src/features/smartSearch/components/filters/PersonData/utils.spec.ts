import { describe, expect, it } from '@jest/globals';

import { DATA_FIELD } from 'features/smartSearch/components/types';
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

const matches = (field: DATA_FIELD, value: string): Criterion => ({
  field,
  operator: DATA_FIELD_OPERATOR.MATCHES,
  value,
});

const isSet = (field: DATA_FIELD): Criterion => ({
  field,
  operator: DATA_FIELD_OPERATOR.IS_SET,
  value: '',
});

describe('PersonData utils', () => {
  describe('canUseIsSet() / getOperatorsForField()', () => {
    it('allows "is set" for text fields', () => {
      expect(canUseIsSet(DATA_FIELD.PHONE)).toBe(true);
      expect(getOperatorsForField(DATA_FIELD.PHONE)).toEqual([
        DATA_FIELD_OPERATOR.MATCHES,
        DATA_FIELD_OPERATOR.IS_SET,
      ]);
    });

    it('does not allow "is set" for gender', () => {
      expect(canUseIsSet(DATA_FIELD.GENDER)).toBe(false);
      expect(getOperatorsForField(DATA_FIELD.GENDER)).toEqual([
        DATA_FIELD_OPERATOR.MATCHES,
      ]);
    });
  });

  describe('getDefaultCriteria()', () => {
    it('starts with an empty "first name matches" criterion', () => {
      expect(getDefaultCriteria()).toEqual([
        matches(DATA_FIELD.FIRST_NAME, ''),
      ]);
    });

    it('is not submittable until a value is entered', () => {
      expect(isSubmittable(getDefaultCriteria())).toBe(false);
    });
  });

  describe('criteriaFromFields()', () => {
    it('reads a non-empty value as "matches"', () => {
      expect(criteriaFromFields({ city: 'Stockholm' })).toEqual([
        matches(DATA_FIELD.CITY, 'Stockholm'),
      ]);
    });

    it('reads an empty string as "is set"', () => {
      expect(criteriaFromFields({ phone: '' })).toEqual([
        isSet(DATA_FIELD.PHONE),
      ]);
    });

    it('reads gender as "matches" and keeps its value', () => {
      expect(criteriaFromFields({ gender: 'f' })).toEqual([
        matches(DATA_FIELD.GENDER, 'f'),
      ]);
    });

    it('sorts criteria by field name, not by DATA_FIELD order', () => {
      // DATA_FIELD lists email before city and alt_phone last
      const criteria = criteriaFromFields({
        alt_phone: '070',
        city: 'Malmö',
        email: '',
      });
      expect(criteria.map((c) => c.field)).toEqual([
        DATA_FIELD.ALT_PHONE,
        DATA_FIELD.CITY,
        DATA_FIELD.EMAIL,
      ]);
    });

    it('returns no criteria for empty fields', () => {
      expect(criteriaFromFields({})).toEqual([]);
    });
  });

  describe('fieldsFromCriteria()', () => {
    it('writes "matches" criteria with their value', () => {
      expect(
        fieldsFromCriteria([matches(DATA_FIELD.CITY, 'Stockholm')])
      ).toEqual({ city: 'Stockholm' });
    });

    it('writes "is set" criteria as an empty string', () => {
      expect(fieldsFromCriteria([isSet(DATA_FIELD.PHONE)])).toEqual({
        phone: '',
      });
    });

    it('ignores a leftover value on an "is set" criterion', () => {
      const criterion = { ...isSet(DATA_FIELD.PHONE), value: '0701' };
      expect(fieldsFromCriteria([criterion])).toEqual({ phone: '' });
    });

    it('combines several criteria', () => {
      expect(
        fieldsFromCriteria([
          isSet(DATA_FIELD.PHONE),
          matches(DATA_FIELD.CITY, 'Stockholm'),
        ])
      ).toEqual({ city: 'Stockholm', phone: '' });
    });
  });

  describe('round trip', () => {
    it('keeps criteria unchanged through fields and back', () => {
      const criteria = [
        matches(DATA_FIELD.CITY, 'Stockholm'),
        isSet(DATA_FIELD.EMAIL),
        isSet(DATA_FIELD.PHONE),
      ];
      expect(criteriaFromFields(fieldsFromCriteria(criteria))).toEqual(
        criteria
      );
    });
  });

  describe('isSubmittable()', () => {
    it('is true for an "is set" criterion without a value', () => {
      expect(isSubmittable([isSet(DATA_FIELD.PHONE)])).toBe(true);
    });

    it('is false for a "matches" criterion without a value', () => {
      expect(isSubmittable([matches(DATA_FIELD.CITY, '')])).toBe(false);
    });

    it('is false if any criterion is incomplete', () => {
      expect(
        isSubmittable([isSet(DATA_FIELD.PHONE), matches(DATA_FIELD.CITY, '')])
      ).toBe(false);
    });

    it('is true when all criteria are complete', () => {
      expect(
        isSubmittable([
          isSet(DATA_FIELD.PHONE),
          matches(DATA_FIELD.CITY, 'Stockholm'),
        ])
      ).toBe(true);
    });
  });
});
