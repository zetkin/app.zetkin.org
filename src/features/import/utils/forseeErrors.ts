import isEmail from 'validator/lib/isEmail';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { ColumnKind, IMPORT_ERROR, Sheet } from './types';

export default function forseeErrors(
  configuredSheet: Sheet,
  countryCode: CountryCode
) {
  const errors: IMPORT_ERROR[] = [];
  const zetkinGenders = ['o', 'f', 'm'];
  let hasIDField = false;

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      if (column.kind == ColumnKind.ID_FIELD) {
        hasIDField = true;
      }

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

            //Check if emails match correct email format
            if (fieldKey == 'email') {
              if (!isEmail(value.toString())) {
                errors.push(IMPORT_ERROR.EMAIL);
              }
            }

            //Check if alt phone number match correct phone format
            if (fieldKey == 'alt_phone') {
              try {
                parsePhoneNumber(
                  typeof value == 'string' ? value : value.toString(),
                  countryCode
                );
              } catch (err) {
                errors.push(IMPORT_ERROR.ALT_PHONE);
              }
            }
          }
        }
      });
    }
  });

  if (!hasIDField) {
    errors.push(IMPORT_ERROR.ID_MISSING);
  }

  return Array.from(new Set(errors));
}
