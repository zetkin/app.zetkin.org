export interface ZetkinEvent {
    activity: {
        title: string
    },
    campaign: {
        id: number,
        title: string
    },
    end_time: string,
    id: number,
    info_text: string,
    location: {
        title: string
    },
    start_time: string,
    title: string
}

export default function getEvent(orgId : string, eventId : string) {
    return async () : Promise<ZetkinEvent> => {
        const cRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();

        for (const obj of cData.data) {
            const eventsRes = await fetch(`http://localhost:3000/api/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();
            const eventData = campaignEvents.data.find(event => event.id == eventId);
            if (eventData) {
                return eventData;
            }
        }

        throw 'not found';
    };
}
