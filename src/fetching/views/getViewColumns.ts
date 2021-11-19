import { defaultFetch } from '..';
import { ZetkinViewColumn } from '../../types/zetkin';

export default function getViewColumns(orgId : string, viewId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinViewColumn[]> => {
        const oRes = await fetch(`/orgs/${orgId}/people/views/${viewId}/columns`);
        const oData = await oRes.json();
        return oData.data;
    };
}
