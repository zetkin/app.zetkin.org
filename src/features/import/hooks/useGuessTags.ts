import Fuse from 'fuse.js';

import { UIDataColumn } from './useUIDataColumn';
import useTagConfig from './useTagConfig';
import useTags from 'features/tags/hooks/useTags';
import { CellData, TagColumn } from '../types';

const useGuessTags = (orgId: number, uiDataColumn: UIDataColumn<TagColumn>) => {
  const tags = useTags(orgId);
  const { assignTags } = useTagConfig(
    orgId,
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );
  const fuse = new Fuse(tags.data || [], {
    includeScore: true,
    keys: ['title'],
    threshold: 0.25,
  });

  const guessTags = () => {
    // Loop through each possible cell value
    const matchedRows = uiDataColumn.uniqueValues.reduce(
      (acc: TagColumn['mapping'], cellValue: CellData) => {
        if (typeof cellValue === 'string' && cellValue.length > 2) {
          // Find tags with most similar name
          const results = fuse.search(cellValue);

          // If there is a match, guess it
          if (results.length > 0) {
            const bestTag = results.sort(
              (a, b) => (a.score ?? 1) - (b.score ?? 1)
            )[0];
            return [
              ...acc,
              {
                score: bestTag.score,
                tags: [{ id: bestTag.item.id }],
                value: cellValue,
              },
            ];
          }
        }
        return acc;
      },
      []
    );

    assignTags(matchedRows);
  };

  return guessTags;
};

export default useGuessTags;
