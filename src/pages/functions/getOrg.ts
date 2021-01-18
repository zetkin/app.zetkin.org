export default function getOrg(orgId : string | string[]) {
    return async () : Promise<{ title: string }> => {
        const oRes = await fetch(`http://localhost:3000/api/orgs/${orgId}`);
        const oData = await oRes.json();
        return oData.data;
    };
}