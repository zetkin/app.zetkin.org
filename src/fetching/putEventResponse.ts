import apiUrl from '../utils/apiUrl';

import { ZetkinEventResponse, ZetkinEventSignup, ZetkinMembership } from '../types/zetkin';

export default async function putEventResponse({ eventId, orgId } : ZetkinEventSignup) : Promise<ZetkinEventResponse> {
    const mUrl = apiUrl('/users/me/memberships');
    const mRes = await fetch(mUrl);
    const mData = await mRes.json();
    const orgMembership = mData.data.find((m : ZetkinMembership ) => m.organization.id === orgId);

    if (orgMembership) {
        const eventUrl = apiUrl(`/orgs/${orgId}/actions/${eventId}/responses/${orgMembership.profile.id}`);
        const eventRes = await fetch(eventUrl, {
            method: 'PUT',
        });
        const eventData = await eventRes.json();
        return eventData.data;
    }

    throw 'no membership';
}