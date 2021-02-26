import apiUrl from '../utils/apiUrl';
import { ZetkinEvent } from '../interfaces/ZetkinEvent';

export default function getEvent(orgId : string, eventId : string) {
    return async () : Promise<ZetkinEvent> => {
        const cRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns`));
        const cData = await cRes.json();

        for (const obj of cData.data) {
            const eventsRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns/${obj.id}/actions`));
            const campaignEvents = await eventsRes.json();
            const eventData = campaignEvents.data.find((event : ZetkinEvent) => event.id.toString() === eventId);
            if (eventData) {
                return eventData;
            }
        }

        throw 'not found';
    };
}
