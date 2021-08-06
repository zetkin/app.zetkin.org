import { defaultFetch } from '..';
import { ZetkinAssignedTask } from 'types/zetkin';

const getAssignedTasks = (orgId : string, taskId: string, fetch = defaultFetch) => {
    return async (): Promise<ZetkinAssignedTask[]> => {
        const url = `/orgs/${orgId}/tasks/${taskId}/assigned`;
        const res = await fetch(url);
        const resData = await res.json();
        return resData?.data;
    };
};

export default getAssignedTasks;
