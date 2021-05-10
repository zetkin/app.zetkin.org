import { defaultFetch } from '.';
import { ZetkinCallAssignment } from '../types/zetkin';

export default function getCallAssignments(fetch = defaultFetch) {
    return async () : Promise<ZetkinCallAssignment[]> => {

        const membershipsRes = await fetch(`/users/me/memberships`);
        const membershipsData = await membershipsRes.json();

        const assRes = await fetch('/users/me/call_assignments');
        const assData = await assRes.json();

        const callAssignments = [];

        if (assData.data) {
            for (const mObj of membershipsData.data) {

                const org = {
                    id: mObj.organization.id,
                    title: mObj.organization.title,
                };

                for (const assObj of assData.data) {
                    if (mObj.organization.id === assObj.organization_id) {
                        callAssignments.push({ ...assObj, organization: org });
                    }
                }
            }
        }
        return callAssignments;
    };
}