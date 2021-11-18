import APIError from 'utils/apiError';
import { ZetkinView } from 'types/zetkin';

import { defaultFetch } from '..';

export default function getViews(orgId: string, fetch = defaultFetch) {
    return async () : Promise<ZetkinView[]> => {
        const url = `/orgs/${orgId}/people/views`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new APIError('GET', url);
        }
        const resData = await res.json();
        return resData.data;
    };
}
