import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { sweden } from 'verifiera';
import { ColumnKind, Sheet } from '../types';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';
import {
  ImportFieldProblem,
  ImportProblem,
  ImportProblemKind,
  ImportRowProblem,
} from './types';

const VALIDATORS: Record<CUSTOM_FIELD_TYPE, (value: string) => boolean> = {
  date: (value) => {
    //checks if field is a valid Swedish 'personnummer', the same library could be used to do checks for other countries, check documentation
    const ssn = sweden(value, false);
    if (ssn.validate()) {
      return true;
    }
    try {
      return new Date(value).toISOString().slice(0, 10) == value;
    } catch (err) {
      return false;
    }
  },
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

  if (!sheetHasId) {
    if (sheetHasFirstName && sheetHasLastName) {
      problems.push({
        kind: ImportProblemKind.UNCONFIGURED_ID,
      });
    } else {
      problems.push({
        kind: ImportProblemKind.UNCONFIGURED_ID_AND_NAME,
      });
    }
  }

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

  sheet.rows.forEach((row, index) => {
    const rowIndex = sheet.firstRowIsHeaders ? index - 1 : index;
    if (rowIndex < 0) {
      // Skip first row when first row is headers
      return;
    }

    let rowHasId = false;
    let rowHasFirstName = false;
    let rowHasLastName = false;

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
            } else if (column.field == 'first_name') {
              rowHasFirstName = true;
            } else if (column.field == 'last_name') {
              rowHasLastName = true;
            } else if (column.field == 'email' && !isEmail(value.toString())) {
              accumulateFieldProblem(column.field, rowIndex);
            } else if (column.field == 'phone' || column.field == 'alt_phone') {
              if (!isValidPhoneNumber(value.toString(), country)) {
                accumulateFieldProblem(column.field, rowIndex);
              }
            } else if (column.field == 'gender') {
              if (!['m', 'f', 'o', ''].includes(value.toString())) {
                accumulateFieldProblem(column.field, rowIndex);
              }
            }
          }
          hadImpact = true;
        }
      }
    });

    if (sheetHasId && sheetHasFirstName && sheetHasLastName) {
      if (!rowHasId && (!rowHasFirstName || !rowHasLastName)) {
        if (!rowProblemByKind[ImportProblemKind.MISSING_ID_AND_NAME]) {
          rowProblemByKind[ImportProblemKind.MISSING_ID_AND_NAME] = {
            indices: [],
            kind: ImportProblemKind.MISSING_ID_AND_NAME,
          };
        }

        rowProblemByKind[ImportProblemKind.MISSING_ID_AND_NAME].indices.push(
          rowIndex
        );
      }
    }
  });

  if (!hadImpact) {
    problems.push({
      kind: ImportProblemKind.NO_IMPACT,
    });
  }

  Object.values(problemByField).forEach((problem) => problems.push(problem));
  Object.values(rowProblemByKind).forEach((problem) => problems.push(problem));

  return problems;
}
