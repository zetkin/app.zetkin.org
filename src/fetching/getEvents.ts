import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getEvents(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const cRes = await fetch(`/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();
        const oRes = await fetch(`/orgs/${orgId}`);
        const oData = await oRes.json();

        const org = {
            id: oData.data.id,
            title: oData.data.title,
        };

        const allEventsData : ZetkinEvent[] = [];

        for (const obj of cData.data) {
            const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();

            for (const eObj of campaignEvents.data) {
                allEventsData.push({ ...eObj, organization: org });
            }
        }
        return allEventsData;
    };
}