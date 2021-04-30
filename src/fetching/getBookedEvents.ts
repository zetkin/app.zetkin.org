import { defaultFetch } from '.';
import { ZetkinBookedEvent } from '../types/zetkin';

export default function getBookedEvents(fetch = defaultFetch) {
    return async () : Promise<ZetkinBookedEvent[]> => {
        const cRes = await fetch('/users/me/actions');
        const cData = await cRes.json();
        return cData.data;
    };
}