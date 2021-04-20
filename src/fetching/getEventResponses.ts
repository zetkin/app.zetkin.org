import { defaultFetch } from '.';
import { ZetkinEventResponse } from '../types/zetkin';

export default function getEventResponses(fetch = defaultFetch) {
    return async () : Promise<ZetkinEventResponse[]> => {
        const rRes = await fetch('/users/me/action_responses');
        const rData = await rRes.json();
        return rData.data;
    };
}