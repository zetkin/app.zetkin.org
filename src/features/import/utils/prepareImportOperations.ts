import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import getUniqueTags from './getUniqueTags';
import { CellData, ColumnKind, Sheet } from './types';
import parserFactory from './dateParsing/parserFactory';

export type ZetkinPersonImportOp = {
  data?: Record<string, CellData>;
  dateFormat?: string | null; //STÄMMER DETTA?
  op: 'person.import';
  organizations?: number[];
  tags?: { id: number }[];
};

export default function prepareImportOperations(
  configuredSheet: Sheet,
  countryCode: CountryCode
): ZetkinPersonImportOp[] {
  const personImportOps: ZetkinPersonImportOp[] = [];

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      configuredSheet.rows.forEach((row, rowIdx) => {
        if (configuredSheet.firstRowIsHeaders && rowIdx === 0) {
          return;
        }

        const rowIndex = configuredSheet.firstRowIsHeaders
          ? rowIdx - 1
          : rowIdx;

        if (!personImportOps[rowIndex]) {
          personImportOps.push({
            op: 'person.import',
          });
        }

        if (column.kind === ColumnKind.ID_FIELD) {
          const fieldKey = column.idField;
          let value = row.data[colIdx];

          if (value) {
            if (fieldKey == 'ext_id') {
              value = value.toString();
            }

            if (fieldKey == 'id') {
              value = parseInt(value.toString());
            }

            personImportOps[rowIndex].data = {
              ...personImportOps[rowIndex].data,
              [`${fieldKey}`]: value,
            };
          }
        }

        if (column.kind === ColumnKind.FIELD) {
          const fieldKey = column.field;
          let value = row.data[colIdx];

          if (value) {
            //Parse phone numbers to international format
            if (fieldKey == 'phone' || fieldKey == 'alt_phone') {
              const parsedPhoneNumber = parsePhoneNumber(
                typeof value == 'string' ? value : value.toString(),
                countryCode
              );
              value = parsedPhoneNumber.format('E.164');
            }

            if (fieldKey == 'email') {
              value = value.toString().trim();
            }

            //If they have uppecase letters we parse to lower
            if (fieldKey == 'gender') {
              value = value.toString().toLowerCase();
            }

            personImportOps[rowIndex].data = {
              ...personImportOps[rowIndex].data,
              [`${fieldKey}`]: value,
            };
          }
        }

        if (column.kind === ColumnKind.TAG) {
          column.mapping.forEach((mappedColumn) => {
            if (mappedColumn.value === row.data[colIdx]) {
              if (!personImportOps[rowIndex].tags) {
                personImportOps[rowIndex].tags = [];
              }
              const allTags =
                personImportOps[rowIndex].tags?.concat(
                  mappedColumn.tags.map((t) => ({ id: t.id }))
                ) ?? [];

              personImportOps[rowIndex].tags = getUniqueTags(allTags);
            }
          });
        }

        if (column.kind === ColumnKind.ORGANIZATION) {
          column.mapping.forEach((mappedColumn) => {
            if (mappedColumn.value === row.data[colIdx] && mappedColumn.orgId) {
              if (!personImportOps[rowIndex].organizations) {
                personImportOps[rowIndex].organizations = [];
              }
              const allOrgs =
                personImportOps[rowIndex]?.organizations?.concat(
                  mappedColumn.orgId
                ) ?? [];
              personImportOps[rowIndex].organizations = Array.from(
                new Set<number>(allOrgs)
              );
            }
          });
        }

        if (column.kind === ColumnKind.ENUM) {
          column.mapping.forEach((mappedColumn) => {
            if (
              mappedColumn.key &&
              ((!mappedColumn.value && !row.data[colIdx]) ||
                mappedColumn.value === row.data[colIdx])
            ) {
              personImportOps[rowIndex].data = {
                ...personImportOps[rowIndex].data,
                [`${column.field}`]: mappedColumn.key,
              };
            }
          });
        }

        if (column.kind === ColumnKind.DATE) {
          if (column.dateFormat) {
            const fieldKey = column.field;
            let value = row.data[colIdx];

            if (value) {
              const parser = parserFactory(column.dateFormat);
              value = parser.parse(value.toString());

              personImportOps[rowIndex].data = {
                ...personImportOps[rowIndex].data,
                [`${fieldKey}`]: value,
              };
            }
          }
        }

        if (column.kind === ColumnKind.GENDER) {
          const match = column.mapping.find(
            (c) => c.value === row.data[colIdx]
          );
          if (match !== undefined) {
            personImportOps[rowIndex].data = {
              ...personImportOps[rowIndex].data,
              gender: match.gender as string,
            };
          }
        }
      });
    }
  });
  return personImportOps;
}
