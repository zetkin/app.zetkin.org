import { defaultFetch } from '.';
import { ZetkinOrganization } from '../types/zetkin';

export default function getOrg(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinOrganization> => {
        const oRes = await fetch(`/orgs/${orgId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}