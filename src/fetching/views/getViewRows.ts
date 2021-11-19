import { defaultFetch } from '..';
import { ZetkinViewRow } from '../../types/zetkin';

export default function getViewRows(orgId : string, viewId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinViewRow[]> => {
        const oRes = await fetch(`/orgs/${orgId}/people/views/${viewId}/rows`);
        const oData = await oRes.json();
        return oData.data;
    };
}
