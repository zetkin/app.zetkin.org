import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { ColumnKind, Sheet } from './types';

const enum IMPORT_ERROR {
  PHONE = 'phone',
}

export default function forseeErrors(
  configuredSheet: Sheet,
  countryCode: CountryCode
) {
  const errors: IMPORT_ERROR[] = [];

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configuredSheet.rows.forEach((row, rowIdx) => {
        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        if (column.kind === ColumnKind.FIELD) {
          const fieldKey = column.field;
          const value = row.data[colIdx];

          if (value) {
            //Parse phone numbers to international format
            if (fieldKey == 'phone') {
              try {
                parsePhoneNumber(
                  typeof value == 'string' ? value : value.toString(),
                  countryCode
                );
              } catch (err) {
                errors.push(IMPORT_ERROR.PHONE);
              }
            }
          }
        }
      });
    }
  });

  return errors;
}
