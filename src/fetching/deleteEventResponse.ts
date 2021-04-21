import apiUrl from '../utils/apiUrl';
import { ZetkinMembership } from '../types/zetkin';

interface MutationVariables {
    eventId: number;
    orgId: number;
}

export default async function deleteEventResponse({ eventId, orgId } : MutationVariables) : Promise<void> {
    const mRes = await fetch(apiUrl('/users/me/memberships'));
    const mData = await mRes.json();
    //TODO: Memberships should be cached.
    const orgMembership = mData.data.find((m : ZetkinMembership ) => m.organization.id === orgId);

    if (orgMembership) {
        await fetch(apiUrl(`/orgs/${orgId}/actions/${eventId}/responses/${orgMembership.profile.id}`), {
            method: 'DELETE',
        });
    }
}