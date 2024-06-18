import getUniqueTags from './getUniqueTags';
import parseDate from './parseDate';
import { CellData, ColumnKind, Sheet } from './types';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

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
              personImportOps[rowIndex].organizations = [mappedColumn.orgId];
            }
          });
        }

        if (column.kind === ColumnKind.DATE) {
          if (column.dateFormat) {
            const fieldKey = column.field;
            let value = row.data[colIdx];

            if (value) {
              value = parseDate(value, column.dateFormat);

              personImportOps[rowIndex].data = {
                ...personImportOps[rowIndex].data,
                [`${fieldKey}`]: value,
              };
            }
          }
        }
      });
    }
  });
  return personImportOps;
}
