import { defaultFetch } from '.';
import { ZetkinEvent, ZetkinEventResponse } from '../types/zetkin';

export default function getEvents(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const cRes = await fetch(`/orgs/${orgId}/campaigns`);
        const cData = await cRes.json();

        const oRes = await fetch(`/orgs/${orgId}`);
        const oData = await oRes.json();

        const bookedRes = await fetch('/users/me/actions');
        const bookedData = await bookedRes.json();

        const rRes = await fetch('/users/me/action_responses');
        const rData = await rRes.json();

        const org = {
            id: oData.data.id,
            title: oData.data.title,
        };

        const allEventsData : ZetkinEvent[] = [];

        for (const obj of cData.data) {
            const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();

            for (const eObj of campaignEvents.data) {
                const isBookedEvent = bookedData.data.some((booked : ZetkinEvent) =>
                    booked.id === eObj.id);

                const hasEventResponse = rData.data.some((response : ZetkinEventResponse) =>
                    response.action_id === eObj.id);

                allEventsData.push({
                    ...eObj,
                    organization: org,
                    userBooked: isBookedEvent,
                    userResponse: hasEventResponse,
                });
            }
        }

        return allEventsData;
    };
}