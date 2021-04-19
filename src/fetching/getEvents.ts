import apiUrl from '../utils/apiUrl';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';

function defaultFetch(path : string, init? : RequestInit) {
    const url = apiUrl(path);
    return fetch(url, init);
}

export default function getEvents(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const cRes = await fetch(`/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();

        let allEventsData : ZetkinEvent[] = [];

        for (const obj of cData.data) {
            const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();
            allEventsData = allEventsData.concat(campaignEvents.data);
        }
        return allEventsData;
    };
}