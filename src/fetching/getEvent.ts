import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getEvent(orgId : string, eventId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent> => {
        const cRes = await fetch(`/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();

        for (const obj of cData.data) {
            const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();
            const eventData = campaignEvents.data.find((event : ZetkinEvent) => event.id.toString() === eventId);
            if (eventData) {
                return eventData;
            }
        }

        throw 'not found';
    };
}
