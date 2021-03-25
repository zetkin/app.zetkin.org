import apiUrl from '../utils/apiUrl';

import { ZetkinMembership } from '../types/zetkin';

export default function putUndoEventResponse(event : number, org : number | undefined) : Promise<ZetkinMembership> {
    const eventUndoSignup = async () => {
        const mUrl = apiUrl('/users/me/memberships');
        const mRes = await fetch(mUrl);
        const mData = await mRes.json();
        const orgMembership = mData.data.find((m : ZetkinMembership) => m.organization.id === org);

        if (orgMembership) {
            const url = apiUrl(`/orgs/${org}/actions/${event}/responses/${orgMembership.profile.id}`);
            const eventRes = await fetch(url, {
                method: 'DELETE',
            });

            if (eventRes.redirected === false) {
                return null;
            }

            const eventData = await eventRes.json();
            return eventData;
        }
    };
    return eventUndoSignup();
}
