import { defaultFetch } from '.';
import { ZetkinCallAssignment } from '../types/zetkin';

export default function getCallAssignments(fetch = defaultFetch) {
    return async () : Promise<ZetkinCallAssignment[]> => {
        const cRes = await fetch('/users/me/call_assignments');
        const cData = await cRes.json();
        return cData.data;
    };
}