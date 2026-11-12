import getUniqueTags from './getUniqueTags';
import { ZetkinPersonImportOp } from './prepareImportOperations';
import { ColumnKind, Sheet } from '../types';
import parserFactory from './dateParsing/parserFactory';

export default function createPreviewData(
  configuredSheet: Sheet,
  personIndex: number
) {
  const personPreviewOp: Partial<ZetkinPersonImportOp> = {};
  const row = configuredSheet.rows[personIndex].data;
  const lnglatValues: Record<string, { lat?: number; lng?: number }> = {};

  configuredSheet.columns.forEach((column, colIdx) => {
    if (column.selected) {
      //ID column and fields
      if (
        column.kind === ColumnKind.ID_FIELD ||
        column.kind === ColumnKind.FIELD
      ) {
        const fieldKey =
          column.kind === ColumnKind.ID_FIELD ? column.idField : column.field;

        if (row[colIdx]) {
          personPreviewOp.data = {
            ...personPreviewOp.data,
            [`${fieldKey}`]: row[colIdx],
          };
        }
      }
      //tags
      if (column.kind === ColumnKind.TAG) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            if (!personPreviewOp.tags) {
              personPreviewOp.tags = [];
            }
            const allTags = personPreviewOp.tags.concat(
              mappedColumn.tags.map((t) => ({ id: t.id }))
            );

            personPreviewOp.tags = getUniqueTags(allTags);
          }
        });
      }
      //orgs
      if (column.kind === ColumnKind.ORGANIZATION) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            if (!personPreviewOp.organizations) {
              personPreviewOp.organizations = [];
            }
            const allOrgs = personPreviewOp.organizations.concat(
              mappedColumn?.orgId as number
            );

            personPreviewOp.organizations = Array.from(
              new Set<number>(allOrgs)
            );
          }
        });
      }
      //enum
      if (column.kind === ColumnKind.ENUM) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            personPreviewOp.data = {
              ...personPreviewOp.data,
              [`${column.field}`]: mappedColumn.key,
            };
          }
        });
      }

      if (column.kind === ColumnKind.DATE) {
        if (row[colIdx] && column.dateFormat) {
          const parser = parserFactory(column.dateFormat);
          const date = parser.parse(row[colIdx]?.toString() ?? '');
          personPreviewOp.data = {
            ...personPreviewOp.data,
            [`${column.field}`]: date,
          };
        }
      }

      if (column.kind === ColumnKind.LNGLAT) {
        const value = row[colIdx];
        const rawCoordinate =
          typeof value == 'number' || typeof value == 'string'
            ? value.toString().trim()
            : '';
        if (rawCoordinate) {
          const coordinate = Number(rawCoordinate.replace(',', '.'));
          if (!isNaN(coordinate)) {
            lnglatValues[column.field] = {
              ...lnglatValues[column.field],
              [column.type]: coordinate,
            };
          }
        }
      }

      if (column.kind === ColumnKind.GENDER) {
        column.mapping.forEach((mappedColumn) => {
          if (
            (!mappedColumn.value && !row[colIdx]) ||
            mappedColumn.value === row[colIdx]
          ) {
            personPreviewOp.data = {
              ...personPreviewOp.data,
              [column.field]: mappedColumn.gender as string,
            };
          }
        });
      }
    }
  });

  Object.entries(lnglatValues).forEach(([field, { lat, lng }]) => {
    if (lat !== undefined && lng !== undefined) {
      personPreviewOp.data = {
        ...personPreviewOp.data,
        [`${field}.lat`]: lat,
        [`${field}.lng`]: lng,
      };
    }
  });

  return personPreviewOp;
}
