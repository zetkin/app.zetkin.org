import { defaultFetch } from '.';
import { ZetkinPerson } from '../types/zetkin';

export default function getPeople(orgId : string, fetch = defaultFetch) {
    return async (): Promise<ZetkinPerson[]> => {
        const res = await fetch(`/orgs/${orgId}/people`);
        const resData = await res.json();
        return resData.data;
    };
}
