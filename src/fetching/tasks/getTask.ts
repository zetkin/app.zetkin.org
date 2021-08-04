import { defaultFetch } from '..';
import { ZetkinTask } from 'types/zetkin';

const getTask = (orgId : string, taskId: string, fetch = defaultFetch) => {
    return async (): Promise<ZetkinTask> => {
        const url = `/orgs/${orgId}/tasks/${taskId}`;
        const res = await fetch(url);
        const resData = await res.json();
        return resData?.data;
    };
};

export default getTask;
