export default function getSurvey(orgId : string, surId : string) {
    return async () : Promise<{ title: string }> => {
        const sIdRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/surveys/${surId}`);
        const sIdData = await sIdRes.json();
        return sIdData.data;
    };
}