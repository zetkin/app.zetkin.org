import { defaultFetch } from '..';
import { ZetkinTask, ZetkinTaskReqBody } from '../../types/zetkin';

const postTask = (orgId : string, fetch = defaultFetch) => {
    return async (data: ZetkinTaskReqBody):Promise<ZetkinTask> => {
        const url = `/orgs/${orgId}/tasks`;

        const body = {
            ...data,
            config: data.config || {},
            target_filters: data.target_filters || [],
        };

        const res = await fetch(url, {
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        const resData = await res.json();
        return resData?.data;
    };
};

export default postTask;
