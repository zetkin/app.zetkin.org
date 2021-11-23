
import APIError from 'utils/apiError';
import { ZetkinView } from 'types/zetkin';

import { defaultFetch } from '..';

export default function createNewView(orgId: string, fetch = defaultFetch) {
    return async () : Promise<ZetkinView> => {
        const url = `/views/createNew?orgId=${orgId}`;

        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (!res.ok) {
            throw new APIError('POST', url);
        }

        const resData = await res.json();
        return resData.data;
    };
}
