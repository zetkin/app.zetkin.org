import apiUrl from "../utils/apiUrl";

interface ZetkinOrganization {
    id: number,
    title: string,
}

export default function getOrg(orgId : string) {
    return async () : Promise<ZetkinOrganization> => {
        const url = apiUrl(`/orgs/${orgId}`);
        const oRes = await fetch(url);
        const oData = await oRes.json();
        return oData.data;
    };
}