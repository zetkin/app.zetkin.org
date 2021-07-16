import { defaultFetch } from '..';
import { ZetkinTask } from '../../types/zetkin';

export default function getAllTasks(orgId : string, fetch = defaultFetch) {
    return async () : Promise<ZetkinTask[]> => {
        const res = await fetch(`/orgs/${orgId}/tasks`);
        const body = await res.json();
        return body.data;
    };
}
