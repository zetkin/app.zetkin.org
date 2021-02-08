interface ZetkinEvent {
    activity: { title: string },
    campaign: { title: string },
    end_time: string,
    id: number,
    location: { title: string },
    start_time: string,
    title: string
}

export default function getCampaignEvents(orgId : string, campId : string) {
    return async () : Promise<ZetkinEvent[]> => {
        const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${campId}/actions`);
        const eventsData = await eventsRes.json();
        return eventsData.data;
    };
}