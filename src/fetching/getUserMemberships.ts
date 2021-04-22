import { defaultFetch } from '.';
import { ZetkinMembership } from '../interfaces/ZetkinMembership';

export default function getUserMemberships(fetch = defaultFetch) {
    return async () : Promise<ZetkinMembership[]> => {
        const cRes = await fetch(`/users/me/memberships`);
        const cData = await cRes.json();

        return cData.data;
    };
}