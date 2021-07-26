import { defaultFetch } from '..';
import { ZetkinTask } from 'types/zetkin';

export default function getTask(orgId : string, taskId: string, fetch = defaultFetch) {
    return async () : Promise<ZetkinTask> => {
        const res = await fetch(`/orgs/${orgId}/tasks/${taskId}`);
        const body = await res.json();
        return body?.data;
    };
}
