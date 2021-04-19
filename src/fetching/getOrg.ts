import apiUrl from '../utils/apiUrl';

import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

function defaultFetch(path : string, init? : RequestInit) {
    const url = apiUrl(path);
    return fetch(url, init);
}

export default function getOrg(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinOrganization> => {
        const oRes = await fetch(`/orgs/${orgId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}