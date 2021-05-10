import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getRespondEvents(fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {

        const membershipsRes = await fetch(`/users/me/memberships`);
        const membershipsData = await membershipsRes.json();

        const responsesRes = await fetch('/users/me/action_responses');
        const responsesData = await responsesRes.json();

        const respondEvents = [];

        if (responsesData.data) {
            for (const mObj of membershipsData.data) {
                const eventsRes = await fetch(`/orgs/${mObj.organization.id}/actions`);
                const eventsData = await eventsRes.json();

                const org = {
                    id: mObj.organization.id,
                    title: mObj.organization.title,
                };

                for (const rObj of responsesData.data) {
                    const event = eventsData.data.find((event : ZetkinEvent) => event.id === rObj.action_id);
                    if (event) {
                        respondEvents.push({ ...event, organization: org });
                    }
                }
            }
        }
        return respondEvents;
    };
}