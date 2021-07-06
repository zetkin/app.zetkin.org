import { defaultFetch } from '.';
import { ZetkinActivity } from '../types/zetkin';

export default function getActivities(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinActivity[]> => {
        const res = await fetch(`/orgs/${orgId}/activities`);
        const resData = await res.json();
        return resData.data;
    };
}
