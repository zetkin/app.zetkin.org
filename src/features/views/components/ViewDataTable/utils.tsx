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

  const searchableStringFields = ['person_field'];
  const searchableObjectFields = ['survey_response', 'person_notes'];

  const getColIdxByFieldType = (fields: string[]) =>
    columns.reduce((output: number[], input, idx) => {
      if (fields.includes(input.type)) {
        output.push(idx);
      }
      return output;
    }, []);

  const stringIndexes = getColIdxByFieldType(searchableStringFields);
  const objectArrayIndexes = getColIdxByFieldType(searchableObjectFields);

  const getSearchableString = (row: { content: unknown[] }) => {
    const rowContent = row.content;
    let searchable = '';

    // Add string field values directly to searchable string
    stringIndexes.forEach((idx) => {
      searchable = [searchable, rowContent[idx]].join(',');
    });

    // Extract string values from object fields and add to searchable string
    objectArrayIndexes.forEach((idx) => {
      const content = rowContent[idx];
      if (content instanceof Array) {
        searchable = [
          searchable,
          content.map((item) => item.text).join(','),
        ].join(',');
      }
    });

    return searchable.toLowerCase();
  };

  return rows.filter((row) => {
    return getSearchableString(row).includes(quickSearch.toLowerCase());
  });
};
