import apiUrl from '../utils/apiUrl';
import { ZetkinMembership } from '../types/zetkin';

export default async function putUserFollowing(orgId : number) : Promise<ZetkinMembership> {
    const mRes = await fetch(apiUrl('/users/me/memberships'));
    const mData = await mRes.json();
    //TODO: Memberships should be cached.
    const orgMembership = mData.data.find((m : ZetkinMembership ) => m.organization.id === orgId);

    if (orgMembership) {
        const fRes = await fetch(apiUrl(`/users/me/following/${orgId}`), {
            method: 'PUT',
        });
        const fResData = await fRes.json();

        return fResData.data;
    }

    throw 'no membership';
}