import { defaultFetch } from '..';
import { ZetkinTask } from '../../types/zetkin';
import { ZetkinTaskRequestBody } from 'types/tasks';

const postTask = (orgId : string, fetch = defaultFetch) => {
    return async (data: ZetkinTaskRequestBody): Promise<ZetkinTask> => {
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

        if (!res.ok) {
            throw new Error(`Error making POST request to ${url}`);
        }

        const resData = await res.json();
        return resData?.data;
    };
};

export default postTask;
