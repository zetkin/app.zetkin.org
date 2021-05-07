import { defaultFetch } from '.';
import { ZetkinEvent } from '../types/zetkin';

export default function getBookedEvents(fetch = defaultFetch) {
    return async () : Promise<ZetkinEvent[]> => {
        const cRes = await fetch('/users/me/actions');
        const cData = await cRes.json();
        return cData.data;
    };
}