import { defaultFetch } from '..';
import { ZetkinSmartSearchFilter } from '../../types/zetkin';

export default function getTaskFilterSpec(orgId : string, taskId: string, fetch = defaultFetch) {
    return async () : Promise<ZetkinSmartSearchFilter[]> => {
        const res = await fetch(`/orgs/${orgId}/tasks/${taskId}/target`);
        const body = await res.json();
        return body.data.filter_spec;
    };
}
