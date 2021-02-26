import apiUrl from '../utils/apiUrl';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';

export default function getEvents(orgId : string) {
    return async () : Promise<ZetkinEvent[]> => {
        const cRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns`));
        const cData = await cRes.json();

        let allEventsData : ZetkinEvent[] = [];

        for (const obj of cData.data) {
            const eventsRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns/${obj.id}/actions`));
            const campaignEvents = await eventsRes.json();
            allEventsData = allEventsData.concat(campaignEvents.data);
        }
        return allEventsData;
    };
}