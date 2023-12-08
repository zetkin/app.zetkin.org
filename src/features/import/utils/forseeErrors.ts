import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { ColumnKind, IMPORT_ERROR, Sheet } from './types';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';

export default function forseeErrors(
  configuredSheet: Sheet,
  countryCode: CountryCode,
  customFields: ZetkinCustomField[]
) {
  const errors: IMPORT_ERROR[] = [];
  const zetkinGenders = ['o', 'f', 'm'];
  let hasIDField = false;
  let hasFirstName = false;
  let hasLastName = false;

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      if (column.kind == ColumnKind.ID_FIELD) {
        hasIDField = true;
      }

      if (column.kind == ColumnKind.FIELD && column.field == 'first_name') {
        hasFirstName = true;
      }

      if (column.kind == ColumnKind.FIELD && column.field == 'last_name') {
        hasLastName = true;
      }

      configuredSheet.rows.forEach((row, rowIdx) => {
        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        if (column.kind === ColumnKind.ID_FIELD) {
          const fieldKey = column.idField;
          let value = row.data[colIdx];

          if (!fieldKey) {
            errors.push(IMPORT_ERROR.NOT_SELECTED_ID_TYPE);
          }

          if (!value) {
            errors.push(IMPORT_ERROR.ID_VALUE_MISSING);
          } else {
            if (fieldKey == 'id') {
              value = parseInt(value.toString());
              if (isNaN(value)) {
                errors.push(IMPORT_ERROR.ID);
              }
            } else if (fieldKey == 'ext_id') {
              if (value.toString().length > 96) {
                errors.push(IMPORT_ERROR.LONG_EXT_ID);
              }
            }
          }
        }

        if (column.kind === ColumnKind.FIELD) {
          const fieldKey = column.field;
          let value = row.data[colIdx];

          if (value) {
            const customField = customFields.find(
              (customField) => customField.slug == fieldKey
            );

            if (customField) {
              //Check if value is a correct url
              if (customField.type == CUSTOM_FIELD_TYPE.URL) {
                if (!isURL(value.toString())) {
                  errors.push(IMPORT_ERROR.URL);
                }
              }

              //Check if value is valid date
              if (customField.type == CUSTOM_FIELD_TYPE.DATE) {
                if (isNaN(Date.parse(value.toString()))) {
                  errors.push(IMPORT_ERROR.DATE);
                }
              }
            }

            //See if parsing phone numbers to international format works
            if (fieldKey == 'phone') {
              let phoneNumber = 'test';
              try {
                const parsedPhoneNumber = parsePhoneNumber(
                  typeof value == 'string' ? value : value.toString(),
                  countryCode
                );
                phoneNumber = parsedPhoneNumber.formatInternational();
              } catch (err) {
                errors.push(IMPORT_ERROR.PHONE);
              }

              if (phoneNumber.length < 5) {
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
              let phoneNumber = '';
              try {
                const parsedPhoneNumber = parsePhoneNumber(
                  typeof value == 'string' ? value : value.toString(),
                  countryCode
                );
                phoneNumber = parsedPhoneNumber.formatInternational();
              } catch (err) {
                errors.push(IMPORT_ERROR.ALT_PHONE);
              }

              if (phoneNumber.length < 5) {
                errors.push(IMPORT_ERROR.ALT_PHONE);
              }
            }

            //Check if alt phone number match correct phone format
            if (fieldKey == 'zip_code') {
              const stringValue = value.toString();
              if (stringValue.length > 10) {
                errors.push(IMPORT_ERROR.POST_CODE);
              }
            }

            //check for too long first names
            if (fieldKey == 'first_name') {
              const stringValue = value.toString();
              if (stringValue.length > 50) {
                errors.push(IMPORT_ERROR.LONG_FIRST_NAME);
              }
            }

            //check for too long last names
            if (fieldKey == 'last_name') {
              const stringValue = value.toString();
              if (stringValue.length > 50) {
                errors.push(IMPORT_ERROR.LONG_LAST_NAME);
              }
            }

            //check for too long c/o address
            if (fieldKey == 'co_address') {
              const stringValue = value.toString();
              if (stringValue.length > 50) {
                errors.push(IMPORT_ERROR.LONG_CO_ADDRESS);
              }
            }

            //check for too long street address
            if (fieldKey == 'street_address') {
              const stringValue = value.toString();
              if (stringValue.length > 50) {
                errors.push(IMPORT_ERROR.LONG_STREET_ADDRESS);
              }
            }

            //check for too long country
            if (fieldKey == 'country') {
              const stringValue = value.toString();
              if (stringValue.length > 50) {
                errors.push(IMPORT_ERROR.LONG_COUNTRY);
              }
            }
          }
        }
      });
    }
  });

  if (!hasIDField && hasFirstName && hasLastName) {
    errors.push(IMPORT_ERROR.ID_MISSING);
  }

  if (!hasIDField && (!hasFirstName || !hasLastName)) {
    errors.push(IMPORT_ERROR.NO_IDENTIFIER);
  }

  return Array.from(new Set(errors));
}
