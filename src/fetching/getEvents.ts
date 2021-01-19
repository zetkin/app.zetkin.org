export default function getEvents(orgId : string) {
    return async () : Promise<{ id: number, title: string }[]> => {
        const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();

        let allEventsData = [];

        for (const obj of cData.data) {
            const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();
            allEventsData = allEventsData.concat(campaignEvents.data);
        }
        return allEventsData;
    };
}