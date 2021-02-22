import apiUrl from "../utils/apiUrl";

export default function getCampaigns(orgId : string) {
    return async () : Promise<{ id: number, title: string }[]> => {
        const cRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns`));
        const cData = await cRes.json();
        return cData.data;
    };
}
