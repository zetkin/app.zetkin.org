import apiUrl from '../utils/apiUrl';

import { ZetkinEventResponse } from '../types/zetkin';

function defaultFetch(path : string, init? : RequestInit) {
    const url = apiUrl(path);
    return fetch(url, init);
}

export default function getEventResponses(fetch = defaultFetch) {
    return async () : Promise<ZetkinEventResponse[]> => {
        const rRes = await fetch('/users/me/action_responses');
        const rData = await rRes.json();
        return rData.data;
    };
}