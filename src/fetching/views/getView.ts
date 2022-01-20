import APIError from 'utils/apiError';
import { defaultFetch } from '..';
import { ZetkinView } from 'types/zetkin';

export default function getView(orgId : string, viewId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinView> => {
        const url = `/orgs/${orgId}/people/views/${viewId}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new APIError('GET', url);
        }
        const resData = await res.json();
        return resData.data;
    };
}
