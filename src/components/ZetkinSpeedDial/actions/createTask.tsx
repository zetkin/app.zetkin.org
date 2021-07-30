/* eslint-disable react/display-name */
import { CheckBox } from '@material-ui/icons';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import postTask from '../../../fetching/tasks/postTask';
import TaskDetailsForm from '../../organize/tasks/forms/TaskDetailsForm';
import { ZetkinTaskReqBody } from '../../../types/zetkin';

import { ACTIONS } from '../constants';
import { ActionConfig, DialogContentBaseProps } from './types';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const router = useRouter();
    const { campId, orgId } = router.query as {campId: string; orgId: string};

    const eventMutation = useMutation(postTask(orgId));

    const handleFormSubmit = async (data: ZetkinTaskReqBody) => {
        const newTask = await eventMutation.mutateAsync(data);
        // Redirect to task page
        router.push(`/organize/${orgId}/campaigns/${campId}/calendar/tasks/${newTask.id}`);
    };

    return (
        <TaskDetailsForm
            onCancel={ closeDialog }
            onSubmit={ handleFormSubmit }
        />
    );
};

const config = {
    icon: <CheckBox />,
    key: ACTIONS.CREATE_TASK,
    name: 'misc.tasks.forms.createTask.title',
    urlKey: 'create-task',
} as ActionConfig;

export {
    config,
    DialogContent,
};
