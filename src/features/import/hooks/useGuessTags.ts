import Fuse from 'fuse.js';

import { UIDataColumn } from './useUIDataColumns';
import useTags from 'features/tags/hooks/useTags';
import { CellData, TagColumn } from '../utils/types';

type TagMap = { id: number; value: CellData };

const useGuessTags = (orgId: number, uiDataColumn: UIDataColumn<TagColumn>) => {
  const tags = useTags(orgId);
  const fuse = new Fuse(tags.data || [], {
    includeScore: true,
    keys: ['title'],
  });

  const guessTags = () => {
    // Loop through each possible cell value
    const matchedRows = uiDataColumn.uniqueValues.reduce(
      (acc: TagMap[], cellValue: string | number) => {
        if (typeof cellValue === 'string') {
          // Find orgs with most similar name
          const results = fuse.search(cellValue);
          // Filter out items with a bad match
          const goodResults = results.filter(
            (result) => result.score && result.score < 0.25
          );
          // If there is a match, guess it
          if (goodResults.length > 0) {
            return [
              ...acc,
              {
                id: goodResults[0].item.id,
                value: cellValue,
              },
            ];
          }
        }
        return acc;
      },
      []
    );

    console.log(matchedRows);

    // uiDataColumn.selectOrgs(matchedRows);
  };

  return guessTags;
};

export default useGuessTags;
