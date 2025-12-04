import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { ColumnKind, Sheet } from '../types';
import parserFactory from './dateParsing/parserFactory';
import { ZetkinPerson } from 'utils/types/zetkin';
import { BulkOp, BulkSubOp } from '../types';
import { cleanPhoneNumber } from './phoneUtils';

export default function prepareImportOperations(
  sheet: Sheet,
  countryCode: CountryCode
): BulkOp[] {
  const preparedOps: BulkOp[] = [];
  const importID = sheet.importID;

  sheet.rows.forEach((row, index) => {
    if (sheet.firstRowIsHeaders && index == 0) {
      return;
    }

    const subOps: BulkSubOp[] = [];

    let key: { id: number } | { ext_id: string } | { email: string } | null =
      null;

    const fields: Partial<ZetkinPerson> = {};

    sheet.columns.forEach((col, index) => {
      if (col.selected) {
        const value = row.data[index];

        if (col.kind == ColumnKind.FIELD) {
          const fieldKey = col.field;
          let value = row.data[index];

          if (value) {
            //Parse phone numbers to international format
            if (fieldKey == 'phone' || fieldKey == 'alt_phone') {
              const parsedPhoneNumber = parsePhoneNumber(
                cleanPhoneNumber(value),
                countryCode
              );
              value = parsedPhoneNumber.format('E.164');
            }

            fields[col.field] = value;
          }
        } else if (col.kind == ColumnKind.ID_FIELD) {
          if (value) {
            if (sheet.importID === col.idField) {
              if (col.idField === 'id') {
                const parsedToInteger = parseInt(value.toString());
                const canBeParsedToInteger = !isNaN(parsedToInteger);
                if (!canBeParsedToInteger) {
                  throw new Error(
                    "Cell value for id field 'id' has to be an integer"
                  );
                }
                key = { id: parsedToInteger };
              } else if (col.idField === 'ext_id') {
                key = { ext_id: value.toString().trim() };
                fields['ext_id'] = value.toString().trim();
              } else if (col.idField === 'email') {
                key = { email: value.toString().trim() };
                fields['email'] = value.toString().trim();
              }
            } else {
              if (col.idField === 'ext_id') {
                fields['ext_id'] = value.toString();
              } else if (col.idField === 'email') {
                fields['email'] = value.toString();
              }
            }
          }
        } else if (col.kind == ColumnKind.DATE) {
          if (col.dateFormat && value) {
            const parser = parserFactory(col.dateFormat);
            fields[col.field] = parser.parse(value.toString());
          }
        } else if (col.kind == ColumnKind.GENDER) {
          col.mapping.forEach((mapping) => {
            if (mapping.value == value) {
              fields.gender = mapping.gender;
            }
          });
        } else if (col.kind == ColumnKind.ENUM) {
          col.mapping.forEach((mapping) => {
            if (mapping.value == value) {
              fields[col.field] = mapping.key;
            }
          });
        } else if (col.kind == ColumnKind.TAG) {
          col.mapping.forEach((mapping) => {
            if (
              value == mapping.value ||
              (value === '' && mapping.value === null)
            ) {
              mapping.tags.forEach((tag) => {
                subOps.push({
                  op: 'person.tag',
                  tag_id: tag.id,
                });
              });
            }
          });
        } else if (col.kind == ColumnKind.ORGANIZATION) {
          col.mapping.forEach((mapping) => {
            if (mapping.value == value && mapping.orgId) {
              subOps.push({
                op: 'person.addtoorg',
                org_id: mapping.orgId,
              });
            }
          });
        }
      }
    });

    const hasFields = Object.keys(fields).length > 0;
    if (hasFields) {
      subOps.push({
        data: fields,
        op: 'person.setfields',
      });
    }

    if (importID && key) {
      preparedOps.push({
        ...(sheet.skipUnknown && { if_none: 'skip' }),
        key,
        op: 'person.get',
        ops: subOps,
      });
    } else {
      preparedOps.push({
        op: 'person.create',
        ops: subOps,
      });
    }
  });

  return preparedOps;
}
