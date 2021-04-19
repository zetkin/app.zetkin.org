import apiUrl from '../utils/apiUrl';

import { ZetkinMembership } from '../types/zetkin';

function defaultFetch(path : string, init? : RequestInit) {
    const url = apiUrl(path);
    return fetch(url, init);
}

interface MutationVariables {
    eventId: number;
    orgId: number;
}

export default function deleteEventResponse(fetch = defaultFetch) {
    return async ({ eventId, orgId } : MutationVariables) : Promise<void> => {
        const mRes = await fetch('/users/me/memberships');
        const mData = await mRes.json();
        //TODO: Memberships should be cached.
        const orgMembership = mData.data.find((m : ZetkinMembership ) => m.organization.id === orgId);

        if (orgMembership) {
            await fetch(`/orgs/${orgId}/actions/${eventId}/responses/${orgMembership.profile.id}`, {
                method: 'DELETE',
            });
        }
    };

}