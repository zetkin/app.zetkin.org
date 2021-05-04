import { BookedEvent } from '../types';
import { defaultFetch } from '.';

export default function getBookedEvents(fetch = defaultFetch) {
    return async () : Promise<BookedEvent[]> => {
        const cRes = await fetch('/users/me/actions');
        const cData = await cRes.json();
        return cData.data;
    };
}