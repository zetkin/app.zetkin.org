import { defaultFetch } from '..';
import { ZetkinTask, ZetkinTaskReqBody } from '../../types/zetkin';

const patchTask = (orgId : string | number, taskId: string | number, fetch = defaultFetch) => {
    return async (data: Partial<ZetkinTaskReqBody>): Promise<ZetkinTask> => {
        const url = `/orgs/${orgId}/tasks/${taskId}`;
        const res = await fetch(url, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });
        const resData = await res.json();
        return resData?.data;
    };
};

export default patchTask;
