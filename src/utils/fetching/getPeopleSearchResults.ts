import defaultFetch from './defaultFetch';
import { ZetkinPerson } from '../types/zetkin';

export default function getPeopleSearchResults(
  searchQuery: string,
  orgId: string,
  fetch = defaultFetch
) {
  return async function (): Promise<ZetkinPerson[]> {
    // Build req body
    const body = JSON.stringify({
      q: searchQuery,
    });

    // Get search results
    const res = await fetch(`/orgs/${orgId}/search/person`, {
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const data = await res.json();
    const results = data?.data;
    return results;
  };
}
