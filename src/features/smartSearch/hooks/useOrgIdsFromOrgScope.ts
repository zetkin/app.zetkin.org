import { FilterConfigOrgOptions } from '../components/types';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';

export default function useOrgIdsFromOrgScope(
  orgId: number,
  scope: FilterConfigOrgOptions
): number[] {
  const orgsFuture = useSubOrganizations(orgId);

  if (Array.isArray(scope)) {
    return scope;
  } else if (!orgsFuture.data) {
    return [];
  } else {
    const output: number[] = [];

    orgsFuture.data.forEach((org) => {
      if (scope == 'all') {
        output.push(org.id);
      } else if (scope == 'suborgs' && org.id != orgId) {
        output.push(org.id);
      }
    });

    return output;
  }
}
