import { useQuery, UseQueryResult } from 'react-query';

import { defaultFetch } from '.';
import { ZetkinPerson } from '../types/zetkin';

export default function getPeopleSearchResults(
    searchQuery: string,
    orgId: string,
    fetch = defaultFetch,
) {
    return async function () : Promise<ZetkinPerson[]> {
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


export const getPeopleSearchResultsQueryKey = (searchQuery: string): ['peopleSearchResults', string] =>
    ['peopleSearchResults', searchQuery];

export const useGetPeopleSearchResults = (searchQuery: string, orgId: string): UseQueryResult<ZetkinPerson[]> => {
    return useQuery(
        getPeopleSearchResultsQueryKey(searchQuery),
        getPeopleSearchResults(searchQuery, orgId),
        { enabled: false },
    );
};