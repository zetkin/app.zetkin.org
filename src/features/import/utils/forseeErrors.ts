import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { ColumnKind, Sheet } from './types';

const enum IMPORT_ERROR {
  GENDER = 'gender',
  PHONE = 'phone',
}

export default function forseeErrors(
  configuredSheet: Sheet,
  countryCode: CountryCode
) {
  const errors: IMPORT_ERROR[] = [];
  const zetkinGenders = ['o', 'f', 'm'];

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configuredSheet.rows.forEach((row, rowIdx) => {
        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        if (column.kind === ColumnKind.FIELD) {
          const fieldKey = column.field;
          let value = row.data[colIdx];

          if (value) {
            //See if parsing phone numbers to international format works
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

            //Check if genders match our format
            if (fieldKey == 'gender') {
              value = value.toString().toLowerCase();
              if (!zetkinGenders.includes(value)) {
                errors.push(IMPORT_ERROR.GENDER);
              }
            }
          }
        }
      });
    }
  });

  return errors;
}
