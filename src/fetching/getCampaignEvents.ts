import { defaultFetch } from '.';
import { ZetkinEvent, ZetkinEventResponse } from '../types/zetkin';

export default function getCampaignEvents(
    orgId : string,
    campId : string,
    fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${campId}/actions`);
        const eventsData = await eventsRes.json();

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

        const campaignEventsData : ZetkinEvent[] = [];

        for (const eObj of eventsData.data) {
            const isBookedEvent = bookedData.data.some((booked : ZetkinEvent) =>
                booked.id === eObj.id);

            const hasEventResponse = rData.data.some((response : ZetkinEventResponse) =>
                response.action_id === eObj.id);

            campaignEventsData.push({
                ...eObj,
                organization: org,
                userBooked: isBookedEvent,
                userResponse: hasEventResponse,
            });
        }
        return campaignEventsData;
    };
}