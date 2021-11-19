import { defaultFetch } from '..';
import { ZetkinView } from '../../types/zetkin';

export default function getView(orgId : string, viewId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinView> => {
        const oRes = await fetch(`/orgs/${orgId}/people/views/${viewId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}
