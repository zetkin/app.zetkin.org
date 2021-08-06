import { defaultFetch } from '..';
import { ZetkinTaskAssignment } from 'types/zetkin';

const getTaskAssignments = (orgId : string, taskId: string, fetch = defaultFetch) => {
    return async (): Promise<ZetkinTaskAssignment[]> => {
        const url = `/orgs/${orgId}/tasks/${taskId}/assigned`;
        const res = await fetch(url);
        const resData = await res.json();
        return resData?.data;
    };
};

export default getTaskAssignments;
