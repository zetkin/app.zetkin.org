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

  return rows.filter((row) => {
    const searchStrings = columns.flatMap((col, idx) => {
      return columnTypes[col.type].getSearchableStrings(row.content[idx], col);
    });

    const lowerCaseQuickSearch = quickSearch.toLowerCase();
    return searchStrings.some((str) =>
      str.toLowerCase().includes(lowerCaseQuickSearch)
    );
  });
};
