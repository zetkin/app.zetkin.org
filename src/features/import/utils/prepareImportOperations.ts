import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { CellData, ColumnKind, Sheet } from './types';
import parserFactory from './dateParsing/parserFactory';
import { ZetkinPerson } from 'utils/types/zetkin';
import { BulkOp, BulkSubOp } from '../types';

// TODO: Get rid of this type and dependencies on it
export type ZetkinPersonImportOp = {
  data?: Record<string, CellData>;
  dateFormat?: string | null; //STÄMMER DETTA?
  op: 'person.import';
  organizations?: number[];
  tags?: { id: number }[];
};

export default function prepareImportOperations(
  sheet: Sheet,
  countryCode: CountryCode
): BulkOp[] {
  const preparedOps: BulkOp[] = [];

  sheet.rows.forEach((row, index) => {
    if (sheet.firstRowIsHeaders && index == 0) {
      return;
    }

    const subOps: BulkSubOp[] = [];

    let zetkinId: number | null = null;
    let extId: string | null = null;

    const fields: Partial<ZetkinPerson> = {};
    sheet.columns.forEach((col, index) => {
      if (col.selected) {
        const value = row.data[index];

        if (col.kind == ColumnKind.FIELD) {
          const colIsPhoneField =
            col.field == 'phone' || col.field == 'alt_phone';
          if (value && colIsPhoneField) {
            const parsedPhoneNumber = parsePhoneNumber(
              value.toString(),
              countryCode
            );
            fields[col.field] = parsedPhoneNumber.format('E.164');
          } else {
            fields[col.field] = value;
          }
        } else if (col.kind == ColumnKind.ID_FIELD) {
          if (value) {
            if (col.idField == 'ext_id') {
              extId = value.toString();
            } else if (col.idField == 'id') {
              zetkinId = parseInt(value.toString());
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
            if (value == mapping.value) {
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

    if (extId && zetkinId) {
      fields.ext_id = extId;
      extId = null;
    }

    const hasFields = Object.keys(fields).length > 0;
    if (hasFields) {
      subOps.push({
        data: fields,
        op: 'person.setfields',
      });
    }

    if (extId) {
      preparedOps.push({
        key: {
          ext_id: extId,
        },
        op: 'person.get',
        ops: subOps,
      });
    } else if (zetkinId) {
      preparedOps.push({
        key: {
          id: zetkinId,
        },
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
