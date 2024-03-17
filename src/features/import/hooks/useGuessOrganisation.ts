import Fuse from 'fuse.js';

import { OrgColumn } from '../utils/types';
import { UIDataColumn } from './useUIDataColumns';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';

const useGuessOrganisaion = (
  orgId: number,
  uiDataColumn: UIDataColumn<OrgColumn>
) => {
  const subOrgs = useSubOrganizations(orgId);

  const fuse = new Fuse(subOrgs.data || [], {
    includeScore: true,
    keys: ['title'],
  });

  const guessOrg = () => {
    // Loop through each title
    const matchedRows = uiDataColumn.uniqueValues.map((orgTitle) => {
      if (typeof orgTitle === 'number') {
        return;
      }
      // Find orgs with most similar name
      const results = fuse.search(orgTitle);
      // Filter out items with a bad match
      const goodResults = results.filter(
        (result) => result.score && result.score < 0.5
      );
      // If there is a match, guess it
      if (goodResults && goodResults.length > 0) {
        return {
          orgId: goodResults[0].item.id,
          value: orgTitle,
        };
      }
    });
    uiDataColumn.selectOrgs(matchedRows.filter((value) => value !== undefined));
  };

  return guessOrg;
};

export default useGuessOrganisaion;
