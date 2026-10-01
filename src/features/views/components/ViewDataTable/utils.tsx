import columnTypes from './columnTypes';
import {
  ZetkinViewColumn,
  ZetkinViewRow,
} from 'features/views/components/types';

export function colIdFromFieldName(colFieldName: string): number {
  // colFieldName is a string like col_10, where 10 is the
  // ID of the view column that this refers to.
  const nameFields = colFieldName.split('_');
  return parseInt(nameFields[1]);
}

export const viewQuickSearch = (
  rows: ZetkinViewRow[],
  columns: ZetkinViewColumn[],
  quickSearch: string
): ZetkinViewRow[] => {
  if (!quickSearch) {
    return rows;
  }

  const searchTerms = quickSearch
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  return rows.filter((row) => {
    const columnsText = columns
      .flatMap((col) => {
        return columnTypes[col.type].getSearchableStrings(
          row.cells[String(col.id)],
          col
        );
      })
      .map((str) => str.toLowerCase());

    // All search terms must be found somewhere in the searchable strings
    return searchTerms.every((term) =>
      columnsText.some((personCol) => personCol.includes(term))
    );
  });
};
