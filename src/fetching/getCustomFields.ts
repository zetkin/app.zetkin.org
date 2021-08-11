import { defaultFetch } from '.';
import { ZetkinDataField } from '../types/zetkin';

export default function getCustomFields(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinDataField[]> => {
        const res = await fetch(`/orgs/${orgId}/people/fields`);
        const body = await res.json();
        return body?.data;
    };
}
