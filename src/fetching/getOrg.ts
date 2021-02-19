interface ZetkinOrganization {
    id: number;
    title: string
}

export default function getOrg(orgId : string) {
    return async () : Promise<ZetkinOrganization> => {
        const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}