import { defaultFetch } from '.';
import { ZetkinEvent, ZetkinEventResponse } from '../types/zetkin';

export default function getEvent(orgId : string, eventId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent> => {
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

        for (const obj of cData.data) {
            const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${obj.id}/actions`);
            const campaignEvents = await eventsRes.json();

            const campaignEvent = campaignEvents.data?.find((event : ZetkinEvent) =>
                event.id.toString() === eventId);

            if (campaignEvent) {
                const isBookedEvent = bookedData.data.some((booked : ZetkinEvent) =>
                    booked.id === campaignEvent.id);

                const hasEventResponse = rData.data.some((response : ZetkinEventResponse) =>
                    response.action_id === campaignEvent.id);

                const eventData = {
                    ...campaignEvent,
                    organization: org,
                    userBooked: isBookedEvent,
                    userResponse: hasEventResponse,
                };
                return eventData;
            }
        }

        throw 'not found';
    };
}
