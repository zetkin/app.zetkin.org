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
            throw new Error(`Error making PATCH request to ${url}`);
        }
        return await res.json();
    };
}
