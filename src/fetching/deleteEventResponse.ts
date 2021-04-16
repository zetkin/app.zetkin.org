import apiUrl from '../utils/apiUrl';

import { ZetkinEventSignup, ZetkinMembership } from '../types/zetkin';

export default async function deleteEventResponse({ eventId, orgId } : ZetkinEventSignup) : Promise<void> {
    const mUrl = apiUrl('/users/me/memberships');
    const mRes = await fetch(mUrl);
    const mData = await mRes.json();
    //TODO: Memberships should be cached.
    const orgMembership = mData.data.find((m : ZetkinMembership) => m.organization.id === orgId);

    if (orgMembership) {
        const url = apiUrl(`/orgs/${orgId}/actions/${eventId}/responses/${orgMembership.profile.id}`);
        await fetch(url, {
            method: 'DELETE',
        });
    }
}
