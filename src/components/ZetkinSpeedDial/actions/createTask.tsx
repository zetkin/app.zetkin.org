/* eslint-disable react/display-name */
import { ACTIONS } from '../constants';
import { CheckBox } from '@material-ui/icons';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import CreateTaskForm from '../../organize/tasks/forms/CreateTaskForm';
import postTask from '../../../fetching/tasks/postTask';
import { ZetkinTaskReqBody } from '../../../types/zetkin';
import { ActionConfig, DialogContentBaseProps } from './types';


const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    const router = useRouter();
    const { orgId } = router.query as {campId: string; orgId: string};

    const eventMutation = useMutation(postTask(orgId));

    const handleFormSubmit = (data: ZetkinTaskReqBody) => {
        eventMutation.mutate(data);
        closeDialog();
    };

    return (<CreateTaskForm onCancel={ closeDialog } onSubmit={ handleFormSubmit } />
    );
};

const config = {
    icon: <CheckBox />,
    key: ACTIONS.CREATE_TASK,
    name: 'misc.speedDial.createTask',
    urlKey: 'create-task',
} as ActionConfig;

export {
    config,
    DialogContent,
};
