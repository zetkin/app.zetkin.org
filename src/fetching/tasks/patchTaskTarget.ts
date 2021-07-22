import { defaultFetch } from '..';
import { ZetkinSmartSearchFilter, ZetkinTask } from '../../types/zetkin';

const patchTaskTarget = (orgId : string, taskId: string, fetch = defaultFetch) => {
    return async (data: ZetkinSmartSearchFilter[]):Promise<ZetkinTask> => {
        const url = `/orgs/${orgId}/tasks/${taskId}/target`;
        const body = {
            filter_spec: data,
        };

        const res = await fetch(url, {
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });
        const resData = await res.json();
        return resData?.data;
    };
};

export default patchTaskTarget;
