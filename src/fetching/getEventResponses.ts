import apiUrl from '../utils/apiUrl';

import { ZetkinEventResponse } from '../types/zetkin';

export default async function getEventResponses() : Promise<ZetkinEventResponse[]> {
    const rUrl = apiUrl('/users/me/action_responses');
    const rRes = await fetch(rUrl);
    const rData = await rRes.json();
    return rData.data;
}