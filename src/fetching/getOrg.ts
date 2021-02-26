import apiUrl from '../utils/apiUrl';

import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

export default function getOrg(orgId : string) {
    return async () : Promise<ZetkinOrganization> => {
        const url = apiUrl(`/orgs/${orgId}`);
        const oRes = await fetch(url);
        const oData = await oRes.json();
        return oData.data;
    };
}