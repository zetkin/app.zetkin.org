import apiUrl from '../utils/apiUrl';
import { defaultFetch } from '.';

export default async function getSearchDrawerResults(
    searchQuery: string,
    orgId: string,
    fetch = defaultFetch,
): Promise<Record<string, unknown>> {
    const body = JSON.stringify({
        q: searchQuery,
    });

    const res = await fetch(apiUrl(`/orgs/${orgId}/search/people`), {
        body,
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    const data = await res.json();
    return data;
}
