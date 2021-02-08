export default function getCampaign(orgId : string, campId : string) {
    return async () : Promise<{ title: string, info_text: string }> => {
        const cIdRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${campId}`);
        const cIdData = await cIdRes.json();
        return cIdData.data;
    };
}