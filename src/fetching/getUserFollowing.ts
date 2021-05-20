import { defaultFetch } from '.';
import { ZetkinMembership } from '../types/zetkin';

export default function getUserFollowing(fetch = defaultFetch) {
    return async () : Promise<ZetkinMembership[]> => {
        const fRes = await fetch(`/users/me/following`);
        const fData = await fRes.json();

        return fData.data;
    };
}