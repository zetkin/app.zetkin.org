import { defaultFetch } from '..';

const deleteTask = (orgId : string | number, taskId: string | number, fetch = defaultFetch) => {
    return async (): Promise<void> => {
        const url = `/orgs/${orgId}/tasks/${taskId}`;
        await fetch(url, {
            method: 'DELETE',
        });
    };
};

export default deleteTask;
