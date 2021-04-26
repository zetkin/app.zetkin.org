import { defaultFetch } from '.';
import { ZetkinMembership } from '../types/zetkin';

export default function getUserMemberships(fetch = defaultFetch) {
    return async () : Promise<ZetkinMembership[]> => {
        const cRes = await fetch(`/users/me/memberships`);
        const cData = await cRes.json();

        return cData.data;
    };
}