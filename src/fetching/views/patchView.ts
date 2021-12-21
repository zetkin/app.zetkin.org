import APIError from 'utils/apiError';
import { defaultFetch } from '..';
import { ZetkinView } from 'types/zetkin';

export default function patchView(orgId: string | number, viewId: string | number, fetch = defaultFetch) {
    return async (view: Record<string, unknown>):Promise<ZetkinView> => {
        const url = `/orgs/${orgId}/people/views/${viewId}`;
        const res = await fetch(url, {
            body: JSON.stringify(view),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });
        if (!res.ok) {
            throw new APIError('PATCH', url);
        }
        return await res.json();
    };
}
