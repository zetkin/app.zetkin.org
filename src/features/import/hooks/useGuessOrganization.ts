import Fuse from 'fuse.js';

import { UIDataColumn } from './useUIDataColumn';
import useOrgMapping from './useOrgMapping';
import { ZetkinSubOrganization } from 'utils/types/zetkin';
import { OrgColumn } from '../types';

const useGuessOrganization = (
  orgs: ZetkinSubOrganization[],
  uiDataColumn: UIDataColumn<OrgColumn>
) => {
  const { selectOrgs } = useOrgMapping(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );
  const fuse = new Fuse(orgs, {
    includeScore: true,
    keys: ['title'],
  });

  const guessOrgs = () => {
    // Loop through each possible cell value
    const matchedRows = uiDataColumn.uniqueValues.reduce(
      (acc: OrgColumn['mapping'], orgTitle: string | number) => {
        if (typeof orgTitle === 'string') {
          // Find orgs with most similar name
          const results = fuse.search(orgTitle);
          // Filter out items with a bad match
          const goodResults = results.filter(
            (result) => result.score && result.score < 0.25
          );
          // If there is a match, guess it
          if (goodResults.length > 0) {
            const bestOrg = goodResults.sort(
              (a, b) => (a.score ?? 1) - (b.score ?? 1)
            )[0];
            return [
              ...acc,
              {
                orgId: bestOrg.item.id,
                score: bestOrg.score,
                value: orgTitle,
              },
            ];
          }
        }
        return acc;
      },
      []
    );

    selectOrgs(matchedRows);
  };

  return guessOrgs;
};

export default useGuessOrganization;
