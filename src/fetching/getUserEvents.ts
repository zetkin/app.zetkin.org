import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getUserEvents(fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const fRes = await fetch(`/users/me/following`);
        const fData = await fRes.json();

        const userEventsData = [];

        if (fData.data) {
            for (const fObj of fData.data) {
                const eventsRes = await fetch(`/orgs/${fObj.organization.id}/actions`);
                const eventsData = await eventsRes.json();

                const org = {
                    id: fObj.organization.id,
                    title: fObj.organization.title,
                };

                if (eventsData.data && eventsData.data.length > 0) {
                    for (const eObj of eventsData.data) {
                        userEventsData.push({ ...eObj, organization: org });
                    }
                }
            }
        }
        return userEventsData;
    };
}