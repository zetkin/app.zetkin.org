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
  });

  const guessTags = (): Record<string, number> => {
    const scores: Partial<Record<string, number>> = {};
    // Loop through each possible cell value
    const matchedRows = uiDataColumn.uniqueValues.reduce(
      (acc: TagColumn['mapping'], cellValue: CellData) => {
        if (typeof cellValue === 'string') {
          // Find tags with most similar name
          const results = fuse.search(cellValue);
          // Filter out items with a bad match
          const goodResults = results.filter(
            (result) => result.score && result.score < 0.25
          );
          // If there is a match, guess it
          if (goodResults.length > 0) {
            const bestTag = goodResults.sort(
              (a, b) => (a.score ?? 1) - (b.score ?? 1)
            )[0];
            scores[cellValue] = bestTag.score;
            return [
              ...acc,
              {
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
    return scores as Record<string, number>;
  };

  return guessTags;
};

export default useGuessTags;
