/* eslint-disable react/display-name */
import { ACTIONS } from '../constants';
import { CheckBox } from '@material-ui/icons';
import CreateTaskForm from '../../organize/tasks/forms/CreateTaskForm';
// import postTask from '../../../fetching/postTask';
// import { useMutation } from 'react-query';
// import { useRouter } from 'next/router';
import { ActionConfig, DialogContentBaseProps } from './types';


const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({ closeDialog }) => {
    // const router = useRouter();
    // const { orgId, campId } = router.query as {campId: string; orgId: string};

    // const eventMutation = useMutation(postEvent(orgId));

    // const handleCreateEventFormSubmit = (data: Record<string,unknown>) => {
    //     eventMutation.mutate(data);
    //     closeDialog();
    // };

    return (<CreateTaskForm onCancel={ closeDialog } onSubmit={ closeDialog } />
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
