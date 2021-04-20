import apiUrl from '../utils/apiUrl';
import { ZetkinEventResponse, ZetkinMembership } from '../types/zetkin';

interface MutationVariables {
    eventId: number;
    orgId: number;
}

export default function putEventResponse() {
    return async ({ eventId, orgId } : MutationVariables) : Promise<ZetkinEventResponse> => {
        const mRes = await fetch(apiUrl('/users/me/memberships'));
        const mData = await mRes.json();
        //TODO: Memberships should be cached.
        const orgMembership = mData.data.find((m : ZetkinMembership ) => m.organization.id === orgId);

        if (orgMembership) {
            const eventRes = await fetch(apiUrl(`/orgs/${orgId}/actions/${eventId}/responses/${orgMembership.profile.id}`), {
                method: 'PUT',
            });
            const eventResData = await eventRes.json();

            return eventResData.data;
        }

        throw 'no membership';
    };

}