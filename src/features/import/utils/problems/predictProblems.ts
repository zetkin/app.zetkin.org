import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

import parseDate from '../parseDate';
import { ColumnKind, Sheet } from '../types';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';
import {
  ImportFieldProblem,
  ImportProblem,
  ImportProblemKind,
  ImportRowProblem,
} from './types';

const VALIDATORS: Record<CUSTOM_FIELD_TYPE, (value: string) => boolean> = {
  date: (value) => {
    try {
      return new Date(value).toISOString().slice(0, 10) == value;
    } catch (err) {
      return false;
    }
  },
  enum: () => true,
  json: () => true,
  text: () => true,
  url: (value) => isURL(value),
};

export function predictProblems(
  sheet: Sheet,
  country: CountryCode,
  customFields: ZetkinCustomField[]
): ImportProblem[] {
  const problems: ImportProblem[] = [];
  let hadImpact = false;

  const problemByField: Record<string, ImportFieldProblem> = {};
  const rowProblemByKind: Record<string, ImportRowProblem> = {};

  const sheetHasId = sheet.columns.some(
    (col) => col.kind == ColumnKind.ID_FIELD
  );
  const sheetHasFirstName = sheet.columns.some(
    (col) => col.kind == ColumnKind.FIELD && col.field == 'first_name'
  );
  const sheetHasLastName = sheet.columns.some(
    (col) => col.kind == ColumnKind.FIELD && col.field == 'last_name'
  );

  function accumulateFieldProblem(field: string, row: number) {
    const existing = problemByField[field];
    if (existing) {
      existing.indices.push(row);
    } else {
      problemByField[field] = {
        field: field,
        indices: [row],
        kind: ImportProblemKind.INVALID_FORMAT,
      };
    }
  }

  const customFieldsBySlug: Record<string, ZetkinCustomField> = {};
  customFields.forEach((field) => {
    customFieldsBySlug[field.slug] = field;
  });
  let missingValueInName = false;

  sheet.rows.forEach((row, index) => {
    const rowIndex = sheet.firstRowIsHeaders ? index - 1 : index;
    if (rowIndex < 0) {
      // Skip first row when first row is headers
      return;
    }

    let missingFirstOrLastName = false;
    let rowHasId = false;

    sheet.columns.forEach((column, colIndex) => {
      if (column.selected) {
        const value = row.data[colIndex];

        if (value) {
          if (column.kind == ColumnKind.ID_FIELD) {
            rowHasId = true;
          } else if (column.kind == ColumnKind.FIELD) {
            const fieldInfo = customFieldsBySlug[column.field];
            if (fieldInfo) {
              const validator = VALIDATORS[fieldInfo.type];
              const valid = validator(value.toString());
              if (!valid) {
                accumulateFieldProblem(column.field, rowIndex);
              }
            } else if (
              column.field == 'email' &&
              !isEmail(value.toString().trim())
            ) {
              accumulateFieldProblem(column.field, rowIndex);
            } else if (column.field == 'phone' || column.field == 'alt_phone') {
              const phoneValue = value.toString().replaceAll(/[^+\d]/g, '');
              if (!isValidPhoneNumber(phoneValue.toString(), country)) {
                accumulateFieldProblem(column.field, rowIndex);
              }
            } else if (column.field == 'gender') {
              if (!['m', 'f', 'o', ''].includes(value.toString())) {
                accumulateFieldProblem(column.field, rowIndex);
              }
            }
          } else if (column.kind == ColumnKind.DATE) {
            const validator = VALIDATORS['date'];

            if (column.dateFormat) {
              const date = parseDate(value, column.dateFormat);
              const valid = validator(date);
              if (!valid) {
                accumulateFieldProblem(column.field, rowIndex);
              }
            }
          }
          hadImpact = true;
        } else {
          if (
            column.kind == ColumnKind.FIELD &&
            (column.field == 'first_name' || column.field == 'last_name')
          ) {
            missingFirstOrLastName = true;
            missingValueInName = true;
          }
        }
      }
    });

    // When id is missing and first and last name columns configured but it is missing name value or
    // when id is missing and one of name column configured
    const problemWithIdColumn =
      sheetHasId &&
      !rowHasId &&
      (sheetHasFirstName || sheetHasLastName) &&
      (missingFirstOrLastName || !sheetHasFirstName || !sheetHasLastName);

    // When there is no id column and first and last name columns are configured but missing name value
    const problemWithNoIdColumn =
      !sheetHasId &&
      sheetHasFirstName &&
      sheetHasLastName &&
      missingFirstOrLastName;

    if (problemWithIdColumn || problemWithNoIdColumn) {
      const problemKey = ImportProblemKind.MISSING_ID_AND_NAME;
      if (!rowProblemByKind[problemKey]) {
        rowProblemByKind[problemKey] = {
          indices: [],
          kind: problemKey,
        };
      }
      rowProblemByKind[problemKey].indices.push(rowIndex);
    }
  });

  if (!sheetHasId) {
    if (!sheetHasFirstName || !sheetHasLastName) {
      problems.push({
        kind: ImportProblemKind.UNCONFIGURED_ID_AND_NAME,
      });
    }
    // there are name columns and no missing value
    else if (!missingValueInName) {
      problems.push({
        kind: ImportProblemKind.UNCONFIGURED_ID,
      });
    }
  }

  if (!hadImpact) {
    problems.push({
      kind: ImportProblemKind.NO_IMPACT,
    });
  }

  Object.values(problemByField).forEach((problem) => problems.push(problem));
  Object.values(rowProblemByKind).forEach((problem) => problems.push(problem));

  return problems;
}
