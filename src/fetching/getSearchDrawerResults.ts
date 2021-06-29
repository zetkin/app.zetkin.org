import { defaultFetch } from '.';

export default async function getSearchDrawerResults(
    searchQuery: string,
    orgId: string,
    fetch = defaultFetch,
): Promise<Record<string, unknown>> {
    const body = JSON.stringify({
        q: searchQuery,
    });

    const res = await fetch(`/orgs/${orgId}/search/person`, {
        body,
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
    const data = await res.json();
    return data;
}
