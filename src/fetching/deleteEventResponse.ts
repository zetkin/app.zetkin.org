import apiUrl from '../utils/apiUrl';

import { ZetkinMembership } from '../types/zetkin';

export default async function deleteEventResponse(event : number, orgId : number) : Promise<void> {
    const mUrl = apiUrl('/users/me/memberships');
    const mRes = await fetch(mUrl);
    const mData = await mRes.json();
    const orgMembership = mData.data.find((m : ZetkinMembership) => m.organization.id === orgId);

    if (orgMembership) {
        const url = apiUrl(`/orgs/${orgId}/actions/${event}/responses/${orgMembership.profile.id}`);
        await fetch(url, {
            method: 'DELETE',
        });
    }
}
