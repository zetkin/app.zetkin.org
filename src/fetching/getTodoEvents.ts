import { defaultFetch } from '.';
import { ZetkinEvent, ZetkinEventResponse } from '../types/zetkin';

export default function getTodoEvents(fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {

        const membershipsRes = await fetch(`/users/me/memberships`);
        const membershipsData = await membershipsRes.json();

        const responsesRes = await fetch('/users/me/action_responses');
        const responsesData = await responsesRes.json();

        const todoEvents = [];

        if (responsesData.data) {
            for (const mObj of membershipsData.data) {
                const oEventsRes = await fetch(`/orgs/${mObj.organization.id}/actions`);
                const oEventsData = await oEventsRes.json();

                const org = {
                    id: mObj.organization.id,
                    title: mObj.organization.title,
                };

                for (const eObj of oEventsData.data) {
                    if (responsesData.data.find((r : ZetkinEventResponse) => r.action_id  === eObj.id)) {
                        todoEvents.push({ ...eObj, organization: org });
                    }
                }
            }
        }
        return todoEvents;
    };
}