export default function getEvents(orgId : string) {
    return async () : Promise<{
        activity: { title: string },
        campaign: { title: string },
        end_time: string,
        id: number,
        location: { title: string },
        start_time: string,
        title: string
    }[]> => {
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