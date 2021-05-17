import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getCampaignEvents(
    orgId : string,
    campId : string,
    fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const eventsRes = await fetch(`/orgs/${orgId}/campaigns/${campId}/actions`);
        const eventsData = await eventsRes.json();
        const oRes = await fetch(`/orgs/${orgId}`);
        const oData = await oRes.json();

        const org = {
            id: oData.data.id,
            title: oData.data.title,
        };

        const campaignEventsData : ZetkinEvent[] = [];

        for (const eObj of eventsData.data) {
            campaignEventsData.push({ ...eObj, organization: org });
        }
        return campaignEventsData;
    };
}