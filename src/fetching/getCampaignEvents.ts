import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import apiUrl from '../utils/apiUrl';

export default function getCampaignEvents(orgId : string, campId : string) {
    return async () : Promise<ZetkinEvent[]> => {
        const eventsRes = await fetch(apiUrl(`/orgs/${orgId}/campaigns/${campId}/actions`));
        const eventsData = await eventsRes.json();
        return eventsData.data;
    };
}