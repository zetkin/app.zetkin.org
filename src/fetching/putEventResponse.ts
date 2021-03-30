import apiUrl from '../utils/apiUrl';

import { ZetkinEventResponse, ZetkinMembership } from '../types/zetkin';

export default async function putEventResponse(event : number, org : number | undefined) : Promise<ZetkinEventResponse> {
    const mUrl = apiUrl('/users/me/memberships');
    const mRes = await fetch(mUrl);
    const mData = await mRes.json();
    const orgMembership = mData.data.find((m : ZetkinMembership ) => m.organization.id === org);

    if (orgMembership) {
        const eventUrl = apiUrl(`/orgs/${org}/actions/${event}/responses/${orgMembership.profile.id}`);
        const eventRes = await fetch(eventUrl, {
            method: 'PUT',
        });
        const eventData = await eventRes.json();
        return eventData.data;
    }

    throw 'no membership';
}