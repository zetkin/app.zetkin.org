export default function getCampaigns(orgId : string) {
    return async () : Promise<{ id: number, title: string }[]> => {
        const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        return cData.data;
    };
}
