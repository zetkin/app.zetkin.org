import apiUrl from "../utils/apiUrl";

export default function getSurvey(orgId : string, surId : string) {
    return async () : Promise<{ title: string }> => {
        const sIdRes = await fetch(apiUrl(`/orgs/${orgId}/surveys/${surId}`));
        const sIdData = await sIdRes.json();
        return sIdData.data;
    };
}